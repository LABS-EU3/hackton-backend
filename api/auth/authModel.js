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
    .returning('id')
    .then(([id]) => this.getUserId(id));
  return newUser;
}

async function getUserBy(userValue) {
  const userData = await db('users')
    .where(userValue)
    .first();
  return userData;
}

async function findBy(filter){
  const user = await db('users')
  .where(filter)
  .first()

  return user;
}

async function createOrFindUser(newUser){
  let user = await findBy({email: newUser.email})

  if (!user){
    user = await addUser(newUser)
  }


  return user

}

module.exports = {
  getUserId,
  addUser,
  getUserBy,
  findBy,
  createOrFindUser
};
