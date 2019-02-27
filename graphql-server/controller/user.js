import jwt from "jsonwebtoken";
import passport from "passport";
import User from "models/User.js";
import nodemailer from "nodemailer";
const crypto = require('crypto');
const { promisify } = require('util');

const randomBytesAsync = promisify(crypto.randomBytes);
/**
 * POST /login
 * Sign in using email and password.
 */

const genJWT = ({_id}) => {
  return jwt.sign({_id}, process.env.SERVER_SECRET);
}

exports.genJWT = genJWT;

exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const error = req.validationErrors();

  if (error) {
    return res.send({error});
  }

  passport.authenticate('local', {session: false},(error, user, info) => {
    if (error) { return res.send({error}); }
    if (!user) {
      return res.send({'errors': info});
    }
    req.login(user, {session: false}, (error) => {
      if (error) { return res.send({error}); }
      const token = genJWT(req.user);
      res.send({success: true, token});
    })
  })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password.toString());
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.send({errors});
  }
  const emailVerificationToken = crypto.randomBytes(16).toString('hex');

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    emailVerificationToken
  });

  User.findOne({ email: req.body.email }, (error, existingUser) => {
    if (error) { 
      return res.send(error)  
    }
    if (existingUser) {
      return res.send({error: 'Account with that email address already exists.'});
    }
    user.save((error) => {
      if (error) {
        return res.send(error)
      } else {
        req.login(user, {session: false}, (error) => {
          const token = genJWT(req.user);
          if (error) { return res.send({error}); }
          res.send({success: true, token});
        })

        //send email validation
        if (!user) { return; }
        let transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
        const mailOptions = {
          to: user.email,
          from: 'hackathon@starter.com',
          subject: 'Email Verification',
          text: `Hello,\n\n please click link below to verify your account ${user.email}.\n\n http://${req.headers.host}/verify/${emailVerificationToken}\n\n`
        };
        return transporter.sendMail(mailOptions)
          .catch((err) => {
            if (err.message === 'self signed certificate in certificate chain') {
              console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
              transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                  user: process.env.SENDGRID_USER,
                  pass: process.env.SENDGRID_PASSWORD
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
              return transporter.sendMail(mailOptions)
            }
            console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
            res.send({errors: 'Your Email Verification has been sent, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
            return err;
          });
      }
    });
  });
};

exports.postEmailVerification = (req, res, next) => {
  User.findOne({ emailVerificationToken: req.body.token }).then((user) => {
    if (!user) {
      res.send({'errors': 'Email validation token is invalid' });
    } else {
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.save().then((user, err) => new Promise((resolve, reject) => {
        if (err) res.send(err);
        if (user) {
          res.send({success: true, msg: 'You have successfully verified your email'})
        }
      }));
    }
  })
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password.toString());

  const errors = req.validationErrors();

  if (errors) {
    return res.send({errors});
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      res.send({'success': true, msg: 'Password has been changed.' });
    });
  });
};


/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user._id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    res.send({'success': true, msg: 'Your account has been deleted.' });
  });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirmPassword', 'Passwords must match.').equals(req.body.password.toString());

  const errors = req.validationErrors();

  if (errors) {
    res.send({errors});
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.body.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          return res.send({'errors': 'Password reset token is invalid or has expired.' });
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then((user, err) => new Promise((resolve, reject) => {
          if (err) reject(err);
          resolve(user);
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        res.send({'success' : 'Success! Your password has been changed.' });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              res.send({'success': 'Success! Your password has been changed.' });
            });
        }
        console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
        res.send({errors: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .catch(err => next(err));
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.send({errors});
  }

  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.send({'errors': 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        res.send({'success': true, msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              res.send({'success': true, msg: `An e-mail has been sent to ${user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
        res.send({'errors': 'Error sending the password reset message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .catch(next);
};