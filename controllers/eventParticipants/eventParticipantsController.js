const db = require('./eventParticipantsModel');
const requestHandler = require('../../utils/requestHandler');

function handleEventGetById (res, req) {
    const { id } = req.params;
    db.getById(id)
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