const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('./authModel');
const generateToken = require('../../utils/generateToken');
const bodyValidator = require('../../utils/validator');

const router = express.Router();
const server = require('../server');

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

router.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/api/auth/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
      const userCredentials = {
        id: profile.id,
        username: profile.name.givenName,
        password: profile.id,
        email: profile.emails[0].value,
        fullname: profile.displayName
      };

      const user = await db.createOrFindUser(userCredentials);
      server.locals = user;
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
  (req, res) => {
    server.locals.profile = req.user.profile;
    const token = generateToken(req.user.profile);
    res.redirect(
      `https://hackton-frontend-g3tpfw81r.now.sh/register?google=${token}`
    ); // redirect with the token so that the frontend can extract it for user details
  }
);

module.exports = router;
