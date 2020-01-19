const db = require('../../data/dbConfig');

// project entries models
async function addProject(project) {
  const submittedProject = await db('project_entries')
    .insert(project)
    .returning('*');
  return submittedProject;
}
async function findAllProjectsByEventId(id) {
  const foundAllSubmissions = await db('project_entries')
    .where({
      event_id: id
    })
    .returning('*');
  return foundAllSubmissions;
}
async function findProject(id) {
  const foundSubmission = await db('project_entries')
    .where({
      id
    })
    .returning('*');
  return foundSubmission;
}
async function updateProject(id, project) {
  const updateSubmission = await db('project_entries')
    .where({ id })
    .update(project)
    .returning('*');
  return updateSubmission;
}
async function removeProject(id) {
  const deletedSubmission = await db('project_entries')
    .where({ id })
    .delete();
  return deletedSubmission;
}

// project requirements models
async function add(project) {
  const addedRequirements = await db('project_requirements')
    .insert(project)
    .returning('*');

  return addedRequirements;
}

async function findByEventId(id) {
  const foundReq = await db('project_requirements')
    .where({ event_id: id })
    .returning('*');
  return foundReq;
}

async function find() {
  const foundAllReq = await db('project_requirements');
  return foundAllReq;
}

async function update(id, project) {
  const updateReq = await db('project_requirements')
    .where({ id })
    .update(project)
    .returning('*');
  return updateReq;
}

async function remove(id) {
  const deletedReq = await db('project_requirements')
    .where({ id })
    .delete();
  return deletedReq;
}

module.exports = {
  // Project requirements models
  add,
  find,
  findByEventId,
  update,
  remove,

  // Project entries models
  addProject,
  findProject,
  findAllProjectsByEventId,
  updateProject,
  removeProject
};
