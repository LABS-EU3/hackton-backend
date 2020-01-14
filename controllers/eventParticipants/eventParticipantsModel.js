const db = require('../../data/dbConfig');

function getById () {
    const eventParticipantId = await db('event_participants')
    .where('event_participants.id', id)
    .first()
    return eventParticipantId;
}

module.exports = {
    getById
}