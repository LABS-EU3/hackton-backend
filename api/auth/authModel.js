const bcrypt = require('bcrypt');
const db = require('../../data/dbConfig');

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
    .returning('id')
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

module.exports = {
  getUserId,
  addUser,
  getUserBy,
  findBy,
  createOrFindUser
};
