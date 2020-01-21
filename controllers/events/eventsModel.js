/* eslint-disable no-use-before-define */
const db = require('../../data/dbConfig');

module.exports = {
  add,
  find,
  remove,
  update,
  findById,
  findByTitle,
  getByUserId
};

async function getByUserId(id) {
  const foundEvents = await db('events').where({ creator_id: id });
  return foundEvents;
}

async function findByTitle(title) {
  const foundTitle = await db('events').where({ event_title: title });
  return foundTitle;
}

async function findById(id) {
  const eventId = await db('events as e')
    .join('users as u', ' u.id', 'e.creator_id')
    .select(
      'e.id',
      'e.event_title',
      'e.event_description',
      'e.start_date',
      'e.end_date',
      'e.location',
      'e.tag_name',
      'e.guidelines',
      'e.rubrics',
      'e.requirements',
      'e.creator_id',
      'e.participation_type',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username'
    )
    .where('e.id', `${id}`);
  return eventId;
}

async function update(id, event) {
  const eventUpdate = await db('events')
    .where({ id })
    .update(event)
    .returning('*')
    .then(newEvent => newEvent[0]);
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
  const foundEvent = await db('events as e')
    .join('users as u', ' u.id', 'e.creator_id')
    .select(
      'e.id',
      'e.event_title',
      'e.event_description',
      'e.start_date',
      'e.end_date',
      'e.location',
      'e.tag_name',
      'e.rubrics',
      'e.requirements',
      'e.guidelines',
      'e.creator_id',
      'e.participation_type',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username'
    );
  return foundEvent;
}
