const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const bcrypt = require('bcrypt');

const userModel = require('./auth/authModel');
const generateToken = require('../utils/generateToken');

dotenv.config();
const authRouter = require('../api/auth/authRouter');
const eventsRouter = require('../api/events/eventsRouter');
const eventCategoryRouter = require('../api/eventsCategories/eventCategoryRouter');

const server = express();

// server.use(passport.initialize());
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.URL || 'http://localhost:4000/github'
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, {
//         accessToken,
//         refreshToken,
//         profile
//       });
//     }
//   )
// );

// server.get(
//   '/github',
//   passport.authenticate('github', {
//     scope: ['profile', 'email']
//   }),
//   async (req, res) => {
//     res.redirect(process.env.REDIRECT_URL);
//     server.locals.profile = req.user.profile;
//     const { id, username, _json } = server.locals.profile;
//     // console.log(id, username, _json.email, _json.name);
//     try {
//       // app contains the accessToken, refreshToken and profile from passport
//       const data = server.locals.profile;

//       if (!data) {
//         res.status(400).json({
//           ErrorMessage: 'Github Authentication Failed'
//         });
//       }
//       const user = await userModel.getUserBy({ username });
//       if (!user) {
//         userModel
//           .addUser({
//             id,
//             fullname: _json.name,
//             username,
//             email: _json.email || id,
//             password: bcrypt.hashSync('HackGithub', 15)
//           })
//           .then(newUser => {
//             const token = generateToken(newUser);
//             res.status(201).json({
//               user,
//               token
//             });
//           })
//           .catch(error => {
//             res.status(500).json({
//               message: `Couldnt register user: ${error.message}`,
//               data: error
//             });
//           });
//       }
//       const hash = bcrypt.compareSync('HackGithub', user.password);
//       if (user && hash) {
//         const token = generateToken(user);
//         res.status(200).json({
//           token,
//           userId: user.id
//         });
//       } else {
//         res.status(400).json({
//           message: 'Invalid password!'
//         });
//       }
//     } catch (error) {
//       return error;
//     }
//   }
// );

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/events', eventsRouter);
server.use('/api/event-category', eventCategoryRouter);

server.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Hello from Hackton backend!'
  });
});

server.get('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Invalid route!'
  });
});

module.exports = server;
