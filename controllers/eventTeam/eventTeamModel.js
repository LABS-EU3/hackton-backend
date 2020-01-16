const db = require('../../data/dbConfig');

async function getTeam(eventId) {
  const team = await db('event_team').where({ event_id: eventId });
  return team;
};

async function addTeamMember(data) {
  const [member] = await db('event_team').insert(data, '*');
  return member;
};

async function getUsers() {
  const users = await db('users');
  for (let i = 0; i < users.length; i++){
    const { id, email } = users[i]
    return {id: id, email}
  }
  return users;
};

module.exports = { getTeam, addTeamMember, getUsers };
