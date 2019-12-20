/* eslint-disable no-use-before-define */
const db = require('../../data/dbConfig');

module.exports = {
  add,
  find,
  remove,
  update,
  findById,
  findByTitle
};

async function findByTitle(title) {
  const foundTitle = await db('events').where({ event_title: title });
  return foundTitle;
}

async function findById(id) {
  const eventId = await db('events').where({ id });
  return eventId;
}

async function update(id, event) {
  const eventUpdate = await db('events')
    .where({ id })
    .update(event);
  return eventUpdate;
}

async function remove(id) {
  const eventId = await db('events')
    .where({ id })
    .delete();
  return eventId;
}

async function add(event) {
  const newEvent = await db('events')
    .insert(event)
    .returning('id');
  return newEvent;
}

async function find() {
  const foundEvent = await db('events');
  return foundEvent;
}
