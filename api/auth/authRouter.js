const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./authModel');
const generateToken = require('../../utils/generateToken');
const bodyValidator = require('../../utils/validator');

const router = express.Router();
const server = require('../server');

// Passportjs config
router.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.post('/register', bodyValidator, (req, res) => {
  // endpoint to register
  const newUser = req.body;
  const hash = bcrypt.hashSync(newUser.password, 15);
  newUser.password = hash;

  db.addUser(newUser)
    .then(user => {
      const token = generateToken(user);
      res.status(201).json({
        user,
        token
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Couldnt register user: ${error.message}`,
        data: error
      });
    });
});

router.post('/login', bodyValidator, (req, res) => {
  // login endpoint
  const { email, password } = req.body;

  db.getUserBy({ email })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          token,
          userId: user.id
        });
      } else {
        res.status(400).json({
          message: 'Invalid password!'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Internal server error${error.message}`
      });
    });
});

// google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL_1 || process.env.SERVER_URL_GOOGLE
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
      callbackURL: process.env.CALLBACK_URL_2 || process.env.SERVER_URL_GIT
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

router.get('/token', async (req, res) => {
  try {
    const data = server.locals;
    if (!data) {
      res.status(400).json({
        statusCode: 400,
        message: 'Authentication Failed'
      });
    }
    const user = await db.createOrFindUser(data);
    if (user) {
      req.user = server.locals;
      const token = generateToken(req.user.id);
      res.status(200).json({
        statusCode: 200,
        message: `${req.user.authType} Login was successfull`,
        token
      });
    }
  } catch (error) {
    return error;
  }
});

module.exports = router;
