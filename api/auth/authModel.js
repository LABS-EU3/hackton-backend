const db = require('../../data/dbConfig');

function getUserId(id) {
  return db('users')
    .where('users.id', id)
    .select('fullname', 'username', 'email', 'bio')
    .first();
}

function addUser(user) {
  return db('users')
    .insert(user, 'id')
    .returning('id')
    .then(([id]) => this.getUserId(id));
}

function getUserBy(userValue) {
  return db('users')
    .where(userValue)
    .first();
}

module.exports = {
  getUserId,
  addUser,
  getUserBy
};
