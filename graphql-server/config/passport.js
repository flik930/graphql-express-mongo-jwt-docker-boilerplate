import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import {Strategy as LocalStrategy} from "passport-local";
import FacebookTokenStrategy from "passport-facebook-token";
import User from "../models/User";

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, `Email ${email} not found.`);
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, 'Invalid email or password.');
    });
  });
}));

/**
 * Sign in with jwt.
 */
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SERVER_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err) {b
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }
  });
}));

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  fbGraphVersion: 'v3.0'
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({facebook: profile.id}, function (error, user) {
    if(error) return done(error);
    if (user) {
      return done(null, user);
    } else {
      let user = {};
      user.facebook = profile.id;
      user.tokens = [];
      user.tokens.push({ kind: 'facebook', accessToken });
      user.profile = {}
      user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
      user.profile.gender = user.profile.gender || profile._json.gender;
      user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
      User.create(user, (err, user) => {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
  });
}));
