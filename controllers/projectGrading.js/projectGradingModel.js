const db = require('../../data/dbConfig');

// project entries models
async function addGrading(grade) {
  const submittedGrading = await db('project_grading')
    .insert(grade)
    .returning('*');
  return submittedGrading;
}
async function findAllGradingsByEventId(id) {
  const foundAllSubmissions = await db('project_grading')
    .where({
      event_id: id
    })
    .returning('*');
  return foundAllSubmissions;
}
async function findGrading(id) {
  const foundSubmission = await db('project_grading')
    .where({
      id
    })
    .returning('*');
  return foundSubmission;
}
async function updateGrading(id, project) {
  const updateSubmission = await db('project_grading')
    .where({ id })
    .update(project)
    .returning('*');
  return updateSubmission;
}
async function removeGrading(id) {
  const deletedSubmission = await db('project_grading')
    .where({ id })
    .delete();
  return deletedSubmission;
}

module.exports = {
  // Project entries models
  addGrading,
  findGrading,
  findAllGradingsByEventId,
  updateGrading,
  removeGrading
};
