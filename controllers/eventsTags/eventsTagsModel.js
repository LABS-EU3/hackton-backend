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

async function findByTitle(tagName) {
  const foundTitle = await db('event_tags').where({
    tag_name: tagName
  });
  return foundTitle;
}

async function findById(id) {
  const tagId = await db('event_tags').where({ id });
  return tagId;
}

async function update(id, tag) {
  const tagUpdate = await db('event_tags')
    .where({ id })
    .update(tag)
    .returning('*')
    .then(newTag => newTag[0]);
  return tagUpdate;
}

async function remove(id) {
  const tagId = await db('event_tags')
    .where({ id })
    .delete();
  return tagId;
}

async function add(tag) {
  const eventTag = await db('event_tags')
    .insert(tag)
    .returning('id');
  return eventTag;
}

async function find() {
  const foundTag = await db('event_tags');
  return foundTag;
}
