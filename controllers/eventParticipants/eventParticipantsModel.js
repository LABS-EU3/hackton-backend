const db = require('../../data/dbConfig');

async function getById (id) {
    const eventSelected = await db('event_participants')
    .where('event_participants.id', id)
    .first()
    return eventSelected;
}

async function getAll () {
    const allSelectedEvents = await db('event_participants')
    return allSelectedEvents;
}

async function addCredentials (credentials) {
    const newCredentials = await db('event_participants')
    .insert(credentials)
    .returning('*')
    .then(data => data[0])
    return newCredentials;
}

module.exports = {
    getById,
    getAll,
    addCredentials
}