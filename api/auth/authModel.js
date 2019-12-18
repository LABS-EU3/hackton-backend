const db = require('../../data/dbConfig');

async function getUserId(id) {
  const userId = await db('users')
    .where('users.id', id)
    .select('fullname', 'username', 'email', 'bio')
    .first();
  return userId;
}

async function addUser(user) {
  const newUser = await db('users')
    .insert(user, 'id')
    .then(([id]) => this.getUserId(id));
  return newUser;
}

async function getUserBy(userValue) {
  const userData = await db('users')
    .where(userValue)
    .first();
  return userData;
}

module.exports = {
  getUserId,
  addUser,
  getUserBy
};
