const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./authModel');
const generateToken = require('../../utils/generateToken');
const bodyValidator = require('../../utils/validator');
const router = express.Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

router.post('/register', bodyValidator, (req, res) => { //endpoint to register
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 15);
  user.password = hash;

  db.addUser(user)
    .then(user => {
      const token = generateToken(user);
      res.status(201).json({
        user,
        token: token
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Couldnt register user: ' + error.message,
        data: error
      });
    });
});

router.post('/login', bodyValidator, (req, res) => { //login endpoint
  let { email, password } = req.body;

  db.getUserBy({ email })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          token: token
        });
      } else {
        res.status(400).json({
          message: 'Invalid password!'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Internal server error' + error.message
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
    function(accessToken, refreshToken, profile, done) {
      done(null, {
        accessToken,
        refreshToken,
        profile
      });
      //    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //      return done(err, user);
      //    });
      console.log(profile);

      const userCredentials = {
          username: given_name,
          password: sub,
          email: email,
          fullname: name
      }
    }
  )
);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('https://hackton-frontend-g3tpfw81r.now.sh');
  }
);

module.exports = router;
