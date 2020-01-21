const db = require('./projectGradingModel');
const requestHandler = require('../../utils/requestHandler');

// Project grading

async function handleProjectGradingDelete(req, res) {
  const { id } = req.params;
  await db
    .removeGrading(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project grading deleted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleProjectGradingEdit(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const editedProjectGraging = {
    product_design: req.body.product_design,
    functionality: req.body.functionality,
    project_id: id,
    innovation: req.body.innovation,
    product_fit: req.body.product_fit,
    extensibility: req.body.extensibility,
    presentation: req.body.presentation,
    judge_id: userId,
    event_id: req.body.event_id,
    judge_comments: req.body.judge_comments
  };
  await db
    .updateGrading(id, editedProjectGraging)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Grade edited successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleprojectGradingPost(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const projectGraging = {
    product_design: req.body.product_design,
    functionality: req.body.functionality,
    project_id: id,
    innovation: req.body.innovation,
    product_fit: req.body.product_fit,
    extensibility: req.body.extensibility,
    presentation: req.body.presentation,
    judge_id: userId,
    event_id: req.body.event_id,
    judge_comments: req.body.judge_comments
  };
  await db
    .addGrading(projectGraging)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Grade submitted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetAllProjectGrading(req, res) {
  const { id } = req.params;
  await db
    .findAllGradingsByEventId(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'All project grades retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetProjectGrading(req, res) {
  const { id } = req.params;
  await db
    .findGrading(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project grade retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

module.exports = {
  handleprojectGradingPost,
  handleGetAllProjectGrading,
  handleGetProjectGrading,
  handleProjectGradingEdit,
  handleProjectGradingDelete
};
