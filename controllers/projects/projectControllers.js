const db = require('./projectsModel');
const grades = require('../projectGrading/projectGradingModel');
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
  try {
    const allSubmissions = await db.findAllProjectsByEventId(id);
    const projectGrades = await grades.findAllGradingsByEventId(id);

    // console.log(allSubmissions, '==all data  =', projectGrades);
    const processedData = async (submissions, scores) => {
      // const sortData = [];
      await submissions.map(submit => {
        submit.average_rating = 0;
        return scores.map(mark => {
          if (submit.event_id === mark.project_event_id) {
            console.log(submit.event_id, '==all data  =', mark.average_rating);
            submit.average_rating += mark.average_rating / scores.length;
          }
        });
      });
      return submissions;
    };
    const allProjectScores = await processedData(allSubmissions, projectGrades);
    return requestHandler.success(
      res,
      200,
      'All Project submissions retrieved successfully',
      allProjectScores
    );
  } catch (error) {
    return requestHandler.error(res, 500, ` server error ${error.message}`);
  }
  // await db
  //   .findAllProjectsByEventId(id)
  //   .then(data => {
  //     return requestHandler.success(
  //       res,
  //       200,
  //       'All Project submissions retrieved successfully',
  //       data
  //     );
  //   })
  //   .catch(error => {
  //     return requestHandler.error(res, 500, ` server error ${error.message}`);
  //   });
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

module.exports = {
  handleprojectEntriesPost,
  handleGetAllProjectEntries,
  handleGetProjectEntry,
  handleProjectEntriesEdit,
  handleProjectEntriesDelete
};
