const bcrypt = require('bcrypt');
const db = require('./authModel');
const generateToken = require('../../utils/generateToken');

const server = require('../../api/server');

const register = (req, res) => {
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
};

const Login = (req, res) => {
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
};

const getAuthToken = async (req, res) => {
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
      const token = generateToken(user);
      res.status(200).json({
        statusCode: 200,
        message: `${req.user.authType} Login was successfull`,
        token,
        userDetails: {
          username: user.username,
          email: user.email,
          fullname: user.fullname
        }
      });
    }
  } catch (error) {
    return error;
  }
};

module.exports = { register, Login, getAuthToken };
