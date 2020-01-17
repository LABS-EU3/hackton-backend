const db = require('../../data/dbConfig');

async function getTeam(eventId) {
  const team = await db('event_team').where({ event_id: eventId });
  return team;
}

async function addTeamMember(data) {
  const [member] = await db('event_team').insert(data, '*');
  return member;
}

async function getUsers() {
  const users = await db('users as u')
    .select('u.id', 'u.email', 'u.username', 'u.fullname')
    .returning('*');
  return users;
}
async function getUsersById(filter) {
  const singleUser = await db('users')
    .select('u.id', 'u.email', 'u.username', 'u.fullname')
    .where(filter)
    .first();
  return singleUser;
}

module.exports = { getTeam, addTeamMember, getUsers, getUsersById };
