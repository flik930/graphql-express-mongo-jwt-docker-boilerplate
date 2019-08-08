import "app-module-path/register";
import { GraphQLServer } from "graphql-yoga";
import "./config/passport";
import mongoose from "mongoose";
import express from "express";
import userController from "./controller/user.js";
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import passport from "passport";
import cors from "cors";
import typeDefs from "schema";
import resolvers from "resolvers";
import jwt from "jsonwebtoken";
import User from "models/User";
import axios from "axios";
import { AuthenticationError } from "apollo-server-core";

mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@mongodb:27017/test?authSource=admin', { useNewUrlParser: true }).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const authenticate = async (resolve, root, args, context, info) => {
  if (!context.user) {
    return new AuthenticationError("Not authorised");
  } else {
    const result = await resolve(root, args, context, info);
    return result;
  }
}

const server = new GraphQLServer({ typeDefs, resolvers, pretty: true, middlewares: [authenticate], context: async (req) => {
  if (req.request.headers && req.request.headers.authorization) {
    const token = req.request.headers.authorization.split(' ')[1];
    const _user = jwt.decode(token, process.env.SERVER_SECRET);
    let user;
    if (_user) {
      user = await User.findById(_user._id);
    } else {
      user = null;
    }
    return {user};
  } else {
    return {user: null};
  }
}});
server.express.use(passport.initialize());
server.start(() => console.log("Server is running on localhost:4000"));

const app = express();

app.use(cors());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', userController.postSignup)
app.post('/emailVerification', userController.postEmailVerification)
app.post('/login', userController.postLogin)

app.post('/forgot', userController.postForgot);
app.post('/reset', userController.postReset)
app.post('/updatePassword', passport.authenticate('jwt', { session: false }), userController.postUpdatePassword)
app.post('/updateProfile', passport.authenticate('jwt', { session: false }), userController.postUpdateProfile)
app.post('/deleteAccount', passport.authenticate('jwt', {session: false}), userController.postDeleteAccount)

app.post('/auth/facebook-token', function(req, res, next){
  axios.get('https://graph.facebook.com/me/?fields=email,name&access_token=' + req.body.token).then(async (result) => {
    const picture = await axios.get('https://graph.facebook.com/v4.0/me/picture?height=200&redirect=0&access_token=' + req.body.token);
    const matchObj = {$or: [{facebook: result.data.id}, {email: result.data.email}]};
    const updateObj = {facebook: result.data.id, email: result.data.email, name: result.data.name, pictureUrl: picture.data.data.url};

    User.findOne(matchObj, async (error, user) => {
      if(error) res.status(400).send({error})
      if (user) {
        const token = userController.genJWT({_id: user._id});
        res.send({success: true, token});
      } else {
        const user = await User.create(updateObj);
        const token = userController.genJWT({_id: user._id});
        res.send({success: true, token});
      }
    })
  }).catch(function (error) {
    // handle error
    console.log('error', error);
    res.send({error});
  })
});

app.listen(3001);