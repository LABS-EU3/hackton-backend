const db = require('./authModel');
const generateToken = require('../../utils/generateToken');
const requestHandler = require('../../utils/requestHandler');

const server = require('../../api/server');

const register = (req, res) => {
  // endpoint to register
  try {
    const newUser = req.newuser;
    generateToken(res, 201, 'Signup succesful', newUser);
  } catch (err) {
    return requestHandler.error(res, 500, `server error ${err.message}`);
  }
};

const Login = (req, res) => {
  // login endpoint
  try {
    const payload = req.checked;
    generateToken(res, 200, 'Login succesful', payload);
  } catch (err) {
    return requestHandler.error(res, 500, `server error ${err}`);
  }
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
