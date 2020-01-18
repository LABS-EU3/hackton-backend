const db = require('../../data/dbConfig');

async function getByEventId(id) {
  const eventSelected = await db('event_participants as e')
    .join('users as u', 'u.id', 'e.user_id')
    .select(
      'e.user_id',
      'u.email as participants_email',
      'u.fullname as participants_name',
      'u.username as participants_username'
    )
    .where('e.event_id', id);
  return eventSelected;
}

async function addCredentials(credentials) {
  const newCredentials = await db('event_participants')
    .insert(credentials)
    .returning('*')
    .then(data => data[0]);
  return newCredentials;
}

// eslint-disable-next-line camelcase
async function remove(user_id, event_id) {
  const deleteEvent = await db('event_participants as e')
    .where('e.user_id', user_id)
    .where('e.event_id', event_id)
    .del();
  return deleteEvent;
}

module.exports = {
  getByEventId,
  addCredentials,
  remove
};
