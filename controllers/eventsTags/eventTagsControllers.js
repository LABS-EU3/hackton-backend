/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const db = require('./eventsTagsModel');
const requestHandler = require('../../utils/requestHandler');

function handleTagsDelete(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(() => {
      return requestHandler.success(
        res,
        200,
        'your event tag was deleted successfully!'
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleTagsEdit(req, res) {
  const { id } = req.params;
  const editedTag = {
    tag_name: req.body.tag_name
  };
  db.update(id, editedTag)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'your event tag was edited successfully!',
        { tag: data }
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleTagsPost(req, res) {
  const tag = req.body;
  db.add(tag)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'your event tag was added successfully!',
        { tag_id: Number(data.toString()) }
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

function handleTagsGet(req, res) {
  db.find()
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'All Tags retrieved Successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, `server error ${error.message}`);
    });
}

module.exports = {
  handleTagsDelete,
  handleTagsEdit,
  handleTagsPost,
  handleTagsGet
};
