/* eslint-disable no-use-before-define */
const db = require('../../data/dbConfig');

module.exports = {
  add,
  find,
  remove,
  update,
  findById
};

function findById(id) {
  return db('events').where({ id });
}

function update(id, event) {
  return db('events')
    .where({ id })
    .update(event);
}

function remove(id) {
  return db('events')
    .where({ id })
    .delete();
}

function add(event) {
  return db('events')
    .insert(event)
    .returning('id');
}

function find() {
  return db('events');
}
