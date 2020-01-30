const bcrypt = require('bcrypt');
const decode = require('jwt-decode');
const db = require('../../models/userModel');
const { generateToken } = require('../../utils/generateToken');
const requestHandler = require('../../utils/requestHandler');
const Mailer = require('../../utils/mailHandler');
const server = require('../../api/server');
const checkItem = require('../../utils/checkInputs');
const userModel = require('../../models/userModel');

const register = (req, res) => {
  // endpoint to register
  try {
    const newUser = req.newuser;
    const { id } = req.params;
    if (id) {
      generateToken(
        res,
        201,
        'You are successfully signed up to hackathon',
        newUser
      );
    } else {
      generateToken(res, 201, 'Signup succesful', newUser);
    }
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

const passwordReset = async (req, res) => {
  try {
    const user = req.checked;
    return Mailer.forgotPassword(
      res,
      200,
      'A reset password token has been sent to this email',
      user
    );
  } catch (err) {
    return requestHandler.error(res, 500, `server error ${err}`);
  }
};

const newPassword = async (req, res) => {
  try {
    const token = await server.locals;
    if (token) {
      const { __uid } = decode(token);
      const { password } = req.body;
      const check = checkItem({ password });
      if (Object.keys(check).length > 0) {
        return requestHandler.error(res, 400, check);
      }
      const hash = await bcrypt.hash(password, 15);
      const foundUser = userModel.getSingleUser({ id: __uid });
      if (foundUser) {
        await userModel.updateUser({ password: hash }, __uid);
        return Mailer.resetPassword(
          res,
          200,
          'Your Password Has Been Updated Successfully',
          foundUser.email
        );
      }
    }
    return requestHandler.error(res, 400, `reset password token not available`);
  } catch (err) {
    return requestHandler.error(res, 500, `server error ${err}`);
  }
};

module.exports = { register, Login, getAuthToken, passwordReset, newPassword };
