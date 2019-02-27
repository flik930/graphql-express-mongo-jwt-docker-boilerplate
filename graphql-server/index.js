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

mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@mongodb:27017/test?authSource=admin', { useNewUrlParser: true }).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const server = new GraphQLServer({ typeDefs, resolvers, context: (req) => {
  if (req.request.headers && req.request.headers.authorization) {
    const token = req.request.headers.authorization.split(' ')[1];
    const user = jwt.decode(token, process.env.SERVER_SECRET);
    return {user}
  } else {
    return {user: null}
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

app.post('/login', userController.postLogin)

app.post('/forgot', userController.postForgot);
app.post('/reset', passport.authenticate('jwt', {session:false}), userController.postReset)
app.post('/updatePassword', passport.authenticate('jwt', { session: false }), userController.postUpdatePassword)

app.post('/deleteAccount', passport.authenticate('jwt', {session: false}), userController.postDeleteAccount)

app.post('/auth/facebook/token', function(req, res, next){
  passport.authenticate('facebook-token',
  function (erros, user) {
    if (erros) res.send({erros})
    const token = userController.genJWT(user);
    res.send({success: true, token})
  })(req, res, next)
});

app.listen(3000);