/* eslint-disable camelcase */
const checkItem = require('../utils/checkInputs');
const requestHandler = require('../utils/requestHandler');
const categoriesModel = require('../controllers/eventsCategories/eventCategoryModel');
const eventModel = require('../controllers/events/eventsModel');
require('dotenv').config();

/**
 * Validates all routes
 * @class EventValidator
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
    const query = req.baseUrl.split('/')[1]
    console.log(req.baseUrl.split('/'), '====');
    eventModel
      .findById(id)
      .then(data => {
        if (data.length === 0) {
          return requestHandler.error(
            res,
            404,
            'This event id cannot be found,please provide a valid event id'
          );
        }
        req.event = data;
        return next();
      })
      .catch(error => {
        return requestHandler.error(res, 500, `Server error ${error}`);
      });
  }

  static async eventValidation(req, res, next) {
    const {
      event_title,
      participation_type,
      event_description,
      guidelines,
      start_date,
      end_date,
      location,
      category_id
    } = req.body;
    const exists = await eventModel.findByTitle(event_title);
    if (exists.length !== 0) {
      return requestHandler.error(
        res,
        409,
        'This event title already exists in the database, please pick a new event title!'
      );
    }
    const check = checkItem({
      event_title,
      participation_type,
      event_description,
      guidelines,
      start_date,
      end_date,
      location,
      category_id
    });

    if (Object.keys(check).length > 0) {
      return requestHandler.error(res, 400, check);
    }
    return next();
  }
};
