/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const db = require('./eventCategoryModel');

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

module.exports = {
  handleCategoriesDelete,
  handleCategoriesEdit,
  handleCategoriesPost,
  handleCategoriesGet
};
