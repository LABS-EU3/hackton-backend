const db = require('../../data/dbConfig');

async function getByUserId(userId) {
  const eventSelected = await db('event_participants')
    .where('event_participants.user_id', userId)
    .first();
  return eventSelected;
}

async function getById(id) {
  const eventId = await db('events').where({ id });
  return eventId;
}

async function getAll() {
  const allSelectedEvents = await db('event_participants');
  return allSelectedEvents;
}

// async function findByTitle(title) {
//   const foundTitle = await db('events').where({ event_title: title });
//   return foundTitle;
// }

async function addCredentials(credentials) {
  const newCredentials = await db('event_participants')
    .insert(credentials)
    .returning('*')
    .then(data => data[0]);
  return newCredentials;
}

async function update(id, credentials) {
  const credentialsUpdate = await db('event_participants')
    .where('event_participants.id', id)
    .insert(credentials)
    .returning('*')
    .then(data => data[0]);
  return credentialsUpdate;
}

async function remove(id) {
  const deleteEvent = await db('event_participants')
    .where({ id })
    .delete();
  return deleteEvent;
}

module.exports = {
  getByUserId,
  getById,
  getAll,
  addCredentials,
  update,
  remove
};
