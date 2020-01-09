const bcrypt = require('bcrypt');
const checkItem = require('../utils/checkInputs');
const requestHandler = require('../utils/requestHandler');
const userModel = require('../controllers/auth/authModel');
require('dotenv').config();

/**
 * Validates all routes
 * @class UserValidator
 */
module.exports = class UserValidator {
  /**
   * Validates all user details
   * @param {obj} req
   * @param {obj} res
   * @param {obj} next
   * @returns {obj} Validation error messages or contents of req.body
   */
  static async userInput(req, res, next) {
    const { email, password } = req.body;

    const check = checkItem({
      email,
      password
    });
    if (Object.keys(check).length > 0) {
      return res.status(400).json({
        statusCode: 400,
        check
      });
    }
    const userEmail = await userModel.getUserBy({ email });
    let existingUser;
    if (userEmail !== undefined) {
      existingUser = `email ${email}`;
    }
    if (existingUser) {
      return requestHandler.error(
        res,
        409,
        `User with ${existingUser} already exist`
      );
    }

    const hash = await bcrypt.hash(password, 15);
    const newUser = await userModel.addUser({
      email,
      password: hash
    });
    // eslint-disable-next-line require-atomic-updates
    req.newuser = newUser;
    next();
  }

  static async userLogin(req, res, next) {
    const { password, email } = req.body;
    try {
      const check = checkItem({
        email,
        password
      });
      if (Object.keys(check).length > 0) {
        return res.status(400).json({
          statusCode: 400,
          check
        });
      }
      const returnUser = await userModel.getUserBy({ email });

      if (returnUser && returnUser.password) {
        const checkPassword = await bcrypt.compareSync(
          password,
          returnUser.password
        );
        if (returnUser && checkPassword) {
          // eslint-disable-next-line require-atomic-updates
          req.checked = returnUser;
          next();
        }
      }

      return requestHandler.error(res, 400, 'wrong credentials');
    } catch (err) {
      return err;
    }
  }
};
