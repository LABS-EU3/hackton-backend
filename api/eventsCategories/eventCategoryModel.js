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
  return db('event_categories').where({ id });
}

function update(id, category) {
  return db('event_categories')
    .where({ id })
    .update(category);
}

function remove(id) {
  return db('event_categories')
    .where({ id })
    .delete();
}

function add(category) {
  return db('event_categories').insert(category);
}

function find() {
  return db('event_categories');
}
