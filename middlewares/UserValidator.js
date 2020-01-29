const bcrypt = require('bcrypt');
const checkItem = require('../utils/checkInputs');
const requestHandler = require('../utils/requestHandler');
const userModel = require('../models/userModel');
require('dotenv').config();
const teamModel = require('../models/participantTeamsModels');

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
    const { id } = req.params;
    if (id) {
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
      const newUserTeam = await teamModel.addTeamMate({
        team_id: id,
        team_member: newUser.id
      });
      // eslint-disable-next-line require-atomic-updates
      req.newuser = newUser;
      next();
    }

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

  static async userProfile(req, res, next) {
    try {
      const { email, username, fullname, bio } = req.body;
      const check = checkItem({
        email,
        username,
        fullname,
        bio
      });
      if (Object.keys(check).length > 0) {
        return requestHandler.error(res, 400, check);
      }
      next();
    } catch (error) {
      return error;
    }
  }

  static async inviteInput(req, res, next) {
    try {
      const { email } = req.body;
      const check = checkItem({
        email
      });
      if (Object.keys(check).length > 0) {
        return requestHandler.error(res, 400, check);
      }
      next();
    } catch (error) {
      return error;
    }
  }
};
