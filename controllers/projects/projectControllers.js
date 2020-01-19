const db = require('./projectsModel');
const requestHandler = require('../../utils/requestHandler');

// Project Submissions requirements

async function handleProjectEntriesDelete(req, res) {
  const { id } = req.params;
  await db
    .removeProject(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project submission deleted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleProjectEntriesEdit(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const projectSubmit = {
    project_title: req.body.project_title,
    participant_or_team_name: req.body.participant_or_team_name,
    event_id: req.body.event_id,
    project_writeups: req.body.project_writeups,
    git_url: req.body.git_url,
    video_url: req.body.video_url,
    submitted_by: userId
  };
  await db
    .updateProject(id, projectSubmit)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project edited successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleprojectEntriesPost(req, res) {
  const { userId } = req.decodedToken;
  const { id } = req.params;
  const projectSubmit = {
    project_title: req.body.project_title,
    participant_or_team_name: req.body.participant_or_team_name,
    event_id: id,
    project_writeups: req.body.project_writeups,
    git_url: req.body.git_url,
    video_url: req.body.video_url,
    submitted_by: userId
  };
  await db
    .addProject(projectSubmit)
    .then(data => {
      return requestHandler.success(
        res,
        201,
        'Project submitted successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetAllProjectEntries(req, res) {
  const { id } = req.params;
  await db
    .findAllProjectsByEventId(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'All Project submissions retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

async function handleGetProjectEntry(req, res) {
  const { id } = req.params;
  await db
    .findProject(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project submission retrieved successfully',
        data
      );
    })
    .catch(error => {
      return requestHandler.error(res, 500, ` server error ${error.message}`);
    });
}

// Project requirements Helpers

async function handleprojectsReqPost(req, res) {
  const { id } = req.params;
  const projectReq = {
    event_id: id,
    video_url: req.body.video_url,
    git_url: req.body.git_url,
    project_writeup: req.body.project_writeup
  };
  await db
    .add(projectReq)
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

async function handleGetAllProjectReq(req, res) {
  await db
    .find()
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

async function handleGetProjectReqById(req, res) {
  const { id } = req.params;
  await db
    .findByEventId(id)
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

async function handleprojectsReqEdit(req, res) {
  const { id } = req.params;
  const projectReq = {
    event_id: id,
    video_url: req.body.video_url,
    git_url: req.body.git_url,
    project_writeup: req.body.project_writeup
  };
  await db
    .update(id, projectReq)
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

async function handlePRojectReqDelete(req, res) {
  const { id } = req.params;
  await db
    .remove(id)
    .then(data => {
      return requestHandler.success(
        res,
        200,
        'Project requirements deleted successfully',
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
  handleprojectsReqEdit,
  handlePRojectReqDelete,
  handleprojectEntriesPost,
  handleGetAllProjectEntries,
  handleGetProjectEntry,
  handleProjectEntriesEdit,
  handleProjectEntriesDelete
};
