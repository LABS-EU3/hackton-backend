const db = require('../../data/dbConfig');

async function getByEventId(userId, eventId) {
  const eventSelected = await db('event_participants')
    .where('event_participants.user_id', userId)
    .where('event_participants.event_id', eventId)
    .first();
  return eventSelected;
}

async function getAll() {
  const allSelectedEvents = await db('event_participants');
  return allSelectedEvents;
}

async function addCredentials(credentials) {
  const newCredentials = await db('event_participants')
    .insert(credentials)
    .returning('*')
    .then(data => data[0]);
  return newCredentials;
}

async function remove(user_id, event_id) {
  const deleteEvent = await db("event_participants as e")
    .where("e.user_id", user_id)
    .where("e.event_id", event_id)
    .del();
  return deleteEvent
}

module.exports = {
  getByEventId,
  getAll,
  addCredentials,
  remove
};
