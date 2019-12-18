/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const express = require('express');
const db = require('./eventCategoryModel');
const authenticate = require('../auth/authenticate');

const router = express.Router();

router.post('/', authenticate, handleCategoriesPost);
router.get('/', authenticate, handleCategoriesGet);
router.put(
  '/:id',
  authenticate,
  validateID,
  ValidateCategory,
  handleCategoriesEdit
);
router.delete(
  '/:id',
  authenticate,
  validateID,
  ValidateCategory,
  handleCategoriesDelete
);

function handleCategoriesDelete(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(() => {
      res
        .status(200)
        .json({ message: 'your event category was deleted successfully!' });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleCategoriesEdit(req, res) {
  const { id } = req.params;
  const editedCategory = {
    category_name: req.body.category_name
  };
  db.update(id, editedCategory)
    .then(() => {
      res
        .status(201)
        .json({ message: 'your event category was edited successfully!' });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleCategoriesPost(req, res) {
  const category = req.body;
  db.add(category)
    .then(data => {
      res.status(201).json({
        message: 'your event category was added successfully!',
        category_id: Number(data.toString())
      });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleCategoriesGet(req, res) {
  db.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function validateID(req, res, next) {
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

module.exports = router;
