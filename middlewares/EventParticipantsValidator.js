/* eslint-disable camelcase */
const checkItem = require('../utils/checkInputs');
const requestHandler = require('../utils/requestHandler');
const eventParticipantsModel = require('../controllers/eventParticipants/eventParticipantsModel');
require('dotenv').config();

/**
 * Validates all routes
 * @class EventParticipantsValidator
 */
module.exports = class EventValidator {
    /**
     * Validates all event details
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {obj} Validation error messages or contents of req.body
     */
    static async validateID(req, res, next) {
      // validates provided ID is a number
      const { id } = req.params;
      const check = checkItem({ id });
  
      if (Object.keys(check).length > 0) {
        return res.status(400).json({
          statusCode: 400,
          data: [check]
        });
      }
      eventParticipantsModel
        .getById(id)
        .then(data => {
          if (data.length === 0) {
            return requestHandler.error(
              res,
              404,
              'This event id cannot be found,please provide a valid id'
            );
          }
          req.event = data;
          return next();
        })
        .catch(error => {
          return requestHandler.error(res, 500, `Server error ${error}`);
        });
    }
  
    // static async ValidateOtherId(req, res, next) {
    //     const { id } = req.params;
    //     const {
    //       event_id,
    //       user_id
    //     } = req.params;
    //     if (!id) {
    //       const exists = await eventParticipantsModel.findByTitle(event_title);
    //       if (exists.length !== 0) {
    //         return requestHandler.error(
    //           res,
    //           409,
    //           'This event title already exists in the database, please pick a new event title!'
    //         );
    //       }
    //     }
    //     const check = checkItem({
    //         event_id,
    //         user_id
    //     });
    
    //     if (Object.keys(check).length > 0) {
    //       return requestHandler.error(res, 400, check);
    //     }
    //     return next();
    // }
};
  