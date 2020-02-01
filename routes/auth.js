const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../models/userModel');
const UserValidator = require('../middlewares/UserValidator');
const {
  register,
  Login,
  // getAuthToken,
  passwordReset,
  newPassword,
  confirmEmail
} = require('../controllers/authUser/authControllers');
const { getAuthToken, socialAuth } = require('../controllers/auth0');
const authenticate = require('../api/auth/authenticate');

const router = Router();
const server = require('../api/server');

const baseUrl = process.env.BASE_URL;
const redirectUrl = process.env.REDIRECT_URL;

/**
 * User Registration and Login Routes
 */
router.post('/register', UserValidator.userInput, register);

router.post('/register/:id', UserValidator.userInput, register);

router.post('/login', UserValidator.userLogin, Login);

router.route('/forgotpassword').post(UserValidator.inviteInput, passwordReset);
router.route('/resetpassword').patch(UserValidator.validateToken, newPassword);
router.route('/verify_email').post(UserValidator.validateToken, confirmEmail);

// Passportjs config
router.use(passport.initialize());

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// google

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL:
//         `${baseUrl}/api/auth/google/callback` || process.env.LOCAL_URL_GG
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const userCredentials = {
//         username: profile.name.givenName,
//         password: bcrypt.hashSync('Hackton', 15),
//         email: profile.emails[0].value,
//         fullname: profile.displayName
//       };
//       const user = await db.createOrFindUser(userCredentials);
//       server.locals = user;
//       server.locals.authType = 'Google';
//       done(null, {
//         accessToken,
//         refreshToken,
//         profile
//       });
//     }
//   )
// );

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  socialAuth
  // async (req, res) => {
  //   try {
  //     const data = req.user.profile;
  //     if (!data) {
  //       res.status(400).json({
  //         ErrorMessage: 'Google Authentication Failed'
  //       });
  //     }
  //     res.redirect(`${redirectUrl}/register?google=true`); // redirect with the token so that the frontend can extract it for user details
  //   } catch (error) {
  //     return error;
  //   }
  // }
);

// github

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: `${baseUrl}/api/auth/github` || process.env.LOCAL_URL_GIT
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const { id, username, _json } = profile;

//       const userCredentials = {
//         id,
//         fullname: _json.name,
//         username,
//         email: _json.email || id,
//         password: bcrypt.hashSync('Hackton', 15)
//       };
//       const user = await db.createOrFindUser(userCredentials);
//       server.locals = user;
//       server.locals.authType = 'Github';

//       done(null, {
//         accessToken,
//         refreshToken,
//         profile
//       });
//     }
//   )
// );

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['profile', 'email']
  }),
  socialAuth
  // async (req, res) => {
  //   try {
  //     const data = req.user.profile;
  //     if (!data) {
  //       res.status(400).json({
  //         ErrorMessage: 'Github Authentication Failed'
  //       });
  //     }
  //     res.redirect(`${redirectUrl}/register?github=true`);
  //   } catch (error) {
  //     return error;
  //   }
  // }
);

router.get('/token', getAuthToken);

module.exports = router;
