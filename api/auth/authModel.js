const db = require('../../data/dbConfig');

function getUserId(id) {
    return db('users')
    .where('users.id', id)
    .select('fullname', 'username', 'email', 'bio')
    .first()
}

function addUser(user) {
    return db('users')
    .insert(user, 'user.id')
    .then(([id]) => this.getUserId(id))
}

module.exports = {
    getUserId,
    addUser
}