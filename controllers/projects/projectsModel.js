const db = require('../../data/dbConfig');

module.exports = {
  add,
  find,
  findByEventId,
  update,
  remove
};

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
