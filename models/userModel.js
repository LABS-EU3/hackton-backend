const bcrypt = require('bcrypt');
const db = require('../data/dbConfig');

async function getUserId(id) {
  const userId = await db('users')
    .where('users.id', id)
    .select('fullname', 'username', 'email', 'bio')
    .first();
  return userId;
}

const addUser = async user => {
  const newUser = await db('users')
    .insert(user)
    .returning('*')
    .then(data => data[0]);
  return newUser;
};

async function getUserBy(userValue) {
  const userData = await db('users')
    .where(userValue)
    .first();
  return userData;
}

async function findBy(filter) {
  const user = await db('users')
    .where(filter)
    .first();

  return user;
}

async function createOrFindUser(newUser) {
  let user = await findBy({ email: newUser.email });

  if (!user) {
    user = await addUser(newUser);
    return user;
  }
  const hash = bcrypt.compareSync('Hackton', user.password);
  if (hash) {
    return user;
  }
}
/**
 * User Profile Models
 *
 * @returns
 */
async function getUsers() {
  const users = await db('users as u')
    .select('u.id', 'u.email', 'u.username', 'u.fullname', 'u.bio')
    .returning('*');
  return users;
}
async function getSingleUser(filter) {
  const singleUser = await db('users as u')
    .select('u.id', 'u.email', 'u.username', 'u.fullname', 'u.bio')
    .where(filter)
    .first();
  return singleUser;
}
const updateUser = async (changes, id) => {
  const user = await db('users')
    .where({ id })
    .update(changes)
    .returning(['fullname', 'username', 'email', 'bio'])
    .then(userUpdate => userUpdate[0]);
  return user;
};

module.exports = {
  getUserId,
  addUser,
  getUserBy,
  findBy,
  createOrFindUser,
  getUsers,
  getSingleUser,
  updateUser
};