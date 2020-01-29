const db = require('../../models/userModel');
const { generateToken } = require('../../utils/generateToken');
const requestHandler = require('../../utils/requestHandler');
const { sendEmail } = require('../../utils/emailHandler');

const server = require('../../api/server');

const register = (req, res) => {
  // endpoint to register
  try {
    const newUser = req.newuser;
    generateToken(res, 201, 'Signup succesful', newUser);
    // sendEmail('welcome', newUser.email, 'Welcome to hackton');
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

const participantInvite = (req, res) => {
  try {
    const newInvite = req.body;
    sendEmail(
      'Invite to join Hackaton event',
      newInvite.email,
      'You are invited to join hackaton portal. Click this to join or ignore if not interested'
    );
  } catch (err) {
    return requestHandler.error(res, 500, `server error ${err.message}`);
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
      generateToken(
        res,
        200,
        `${req.user.authType} Login was successfull`,
        user
      );
    }
  } catch (error) {
    return error;
  }
};

module.exports = { register, Login, getAuthToken, participantInvite };
