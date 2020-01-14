const db = require('../../data/dbConfig');

function getById () {
    const eventSelected = await db('event_participants')
    .where('event_participants.id', id)
    .first()
    return eventSelected;
}

function getAll () {
    const allSelectedEvents = await db('event_participants')
    return allSelectedEvents;
}

module.exports = {
    getById,
    getAll
}