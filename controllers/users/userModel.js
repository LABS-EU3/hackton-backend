const db = require('../../data/dbConfig');

async function getUsers() {
  const users = await db('users as u')
    .select('u.id', 'u.email', 'u.username', 'u.fullname')
    .returning('*');
  return users;
}
async function getSingleUser(filter) {
  const singleUser = await db('users as u')
    .select('u.id', 'u.email', 'u.username', 'u.fullname')
    .where(filter)
    .first();
  return singleUser;
}

module.exports = { getUsers, getSingleUser };
