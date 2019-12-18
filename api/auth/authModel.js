const db = require('../../data/dbConfig');

module.exports = {
  getUserId,
  addUser,
  getUserBy
};

function getUserId(id) {
  return db('users')
    .where('users.id', id)
    .select('fullname', 'username', 'email', 'bio')
    .first();
}

function addUser(user) {
  return db('users')
    .insert(user, 'id')
    .then(([id]) => this.getUserId(id));
}

function getUserBy(email) {
  return db('users')
    .where({ email })
    .first();
}
