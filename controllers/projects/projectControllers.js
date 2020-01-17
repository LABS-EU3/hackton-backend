const db = require('./projectsModel');
const requestHandler = require('../../utils/requestHandler');

function handleprojectsReqPost(req, res) {
  const { id } = req.params;
  const projectReq = {
    event_id: id,
    video_url: req.body.video_url,
    git_url: req.body.git_url,
    project_writeup: req.body.project_writeup
  };
  db.add(projectReq)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project requirements recorded successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

function handleGetAllProjectReq(req, res) {
  db.find()
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project requirements retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

function handleGetProjectReqById(req, res) {
  const { id } = req.params;
  db.findByEventId(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project requirement retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

function handleprojectsReqEdit(req, res) {
  const { id } = req.params;
  const projectReq = {
    event_id: req.body.event_id,
    video_url: req.body.video_url,
    git_url: req.body.git_url,
    project_writeup: req.body.project_writeup
  };
  db.update(id, projectReq)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project requirements edited successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

module.exports = {
  handleprojectsReqPost,
  handleGetAllProjectReq,
  handleGetProjectReqById,
  handleprojectsReqEdit
};
