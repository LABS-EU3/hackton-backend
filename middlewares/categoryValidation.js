const db = require('../controllers/eventsCategories/eventCategoryModel');
// validators

function validateID(req, res, next) {
  // validates provided ID is a number
  const { id } = req.params;
  if (Number(id)) {
    next();
  } else {
    res
      .status(400)
      .json({ Error: 'Please provide a valid id,an id can only be a number' });
  }
}

function ValidateCategory(req, res, next) {
  // validates the provided event ID exists in the db
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({
          ErrorMessage:
            'This event category id cannot be found,please provide a valid event category id'
        });
      } else {
        req.category = data;
        next();
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function validateDuplicateValues(req, res, next) {
  // checks if the category name already exists in the database
  db.findByTitle(req.body.category_name)
    .then(event => {
      if (event.length === 0) {
        next();
      } else {
        res.status(400).json({
          message:
            'This category name already exists in the database, please pick a new category name!'
        });
      }
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
}

module.exports = {
  validateID,
  ValidateCategory,
  validateDuplicateValues
};
