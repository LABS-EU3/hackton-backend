const db = require('../../data/dbConfig');

async function getTeam(eventId) {
  const team = await db('event_team as team')
    .join('users as u', 'u.id', 'team.user_id')
    .join('events as e', 'e.id', 'team.event_id')
    .select(
      'team.user_id',
      'team.event_id',
      'team.role_type',
      'u.email',
      'u.fullname',
      'u.username'
    )
    .where({ event_id: eventId });
  return team;
}

async function addTeamMember(data) {
  const member = await db('event_team')
    .insert(data)
    .returning('*')
    .then(newMember => newMember[0]);
  return member;
}

module.exports = { getTeam, addTeamMember };
