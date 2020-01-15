const db = require('./eventParticipantsModel');
const requestHandler = require('../../utils/requestHandler');

function handleEventsGetById (res, req) {
    const { id } = req.params;
    db.getByUserId(id)
        .then(data => {
            return requestHandler.success(res, 200, 'Event retrieved successfully', data );
        })
        .catch(error => {
            return requestHandler.error(res, 404, `Event Not Found ${error.message}`)
        })
}

function handleEventGetAll (res, req) {
    db.getAll()
    .then(data => {
        return requestHandler.success(res, 200, 'All events retrieved successfully', data );
    })
    .catch(error => {
        return requestHandler.error(res, 404, `Events Not Found ${error.message}`)
    })
}

function handleEventRegistration (res, req) {
    const user_id = req.decodedToken.userId;
    const { event_id } = req.params;
    db.addCredentials({user_id, event_id})
    .then(data => {
        return requestHandler.success(res, 201, 'Event registered successfully', data );
    })
    .catch(error => {
        return requestHandler.error(res, 500, `Internal server error ${error.message}`)
    })
}

function handleEventDelete (res, req) {
    const { id } = req.params;
    db.remove(id)
    .then(data => {
        return requestHandler.success(res, 200, 'Event deleted successfully', data );
    })
    .catch(error => {
        return requestHandler.error(res, 500, `Internal server error ${error.message}`)
    })
}

module.exports = {
    handleEventsGetById,
    handleEventGetAll,
    handleEventRegistration,
    handleEventDelete
}