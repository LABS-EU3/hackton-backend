const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../controllers/auth/authModel');
const UserValidation = require('../middlewares/UserValidation');
const {
  register,
  Login,
  getAuthToken
} = require('../controllers/auth/authControllers');

const router = Router();
const server = require('../api/server');

/**
 * User Registration and Login Routes
 */
router.post('/register', UserValidation.userInput, register);

router.post('/login', UserValidation.userLogin, Login);

// Passportjs config
router.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.STAGING_CALLBACK_GG || process.env.LOCAL_URL_GG
    },
    async (accessToken, refreshToken, profile, done) => {
      const userCredentials = {
        username: profile.name.givenName,
        password: bcrypt.hashSync('Hackton', 15),
        email: profile.emails[0].value,
        fullname: profile.displayName
      };
      const user = await db.createOrFindUser(userCredentials);
      server.locals = user;
      server.locals.authType = 'Google';
      done(null, {
        accessToken,
        refreshToken,
        profile
      });
    }
  )
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const data = req.user.profile;
      if (!data) {
        res.status(400).json({
          ErrorMessage: 'Google Authentication Failed'
        });
      }
      res.redirect(process.env.REDIRECT_URL_GOOGLE); // redirect with the token so that the frontend can extract it for user details
    } catch (error) {
      return error;
    }
  }
);

// github

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.STAGING_CALLBACK_GIT || process.env.LOCAL_URL_GIT
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, username, _json } = profile;

      const userCredentials = {
        id,
        fullname: _json.name,
        username,
        email: _json.email || id,
        password: bcrypt.hashSync('Hackton', 15)
      };
      const user = await db.createOrFindUser(userCredentials);
      server.locals = user;
      server.locals.authType = 'Github';

      done(null, {
        accessToken,
        refreshToken,
        profile
      });
    }
  )
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['profile', 'email']
  }),
  async (req, res) => {
    try {
      const data = req.user.profile;
      if (!data) {
        res.status(400).json({
          ErrorMessage: 'Github Authentication Failed'
        });
      }
      res.redirect(process.env.REDIRECT_URL_GIT);
    } catch (error) {
      return error;
    }
  }
);

router.get('/token', getAuthToken);

module.exports = router;
