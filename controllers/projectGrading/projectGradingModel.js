const db = require('../../data/dbConfig');

// project grading models
async function addGrading(grade) {
  const submittedGrading = await db('project_grading')
    .insert(grade)
    .returning('*');
  return submittedGrading;
}
async function findAllGradingsByEventId(id) {
  const foundAllGrades = await db('project_grading')
    .where({
      event_id: id
    })
    .returning('*');
  return foundAllGrades;
}
async function findGrading(id) {
  const foundSubmission = await db('project_grading')
    .where({
      project_id: id
    })
    .returning('*');
  return foundSubmission;
}
async function updateGrading(id, grade) {
  const updateGrade = await db('project_grading')
    .where({ project_id: id })
    .update(grade)
    .returning('*');
  return updateGrade;
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
