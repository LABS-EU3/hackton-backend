const db = require('../../data/dbConfig');

module.exports = {
  addRubrics,
  getAllRubrics,
  findRubricById,
  findProjectEntryById,
  findEventById,

};

async function addRubrics(rubrics) {
    const eventRubrics = await db('rubrics')
    .insert(rubrics)
    .returning('*');
    return eventRubrics;
}

async function getAllRubrics() {
    const rubrics = await db('rubrics')
    .returning('*');
    return rubrics;
}

async function findRubricById(id) {
    const rubric = await db('rubrics')
      .where({ id })
      .first();
    return rubric;
}

async function findProjectEntryById (id) {
    const submittedProject = await db ('project_entries')
    .where({ id })
    .first()
    return submittedProject;
}

async function findEventById (id) {
    const registeredEvent = await db ('events')
    .where({ id })
    .first()
    return registeredEvent;
}
