const { Router } = require('express');
const authenticate = require('../api/auth/authenticate');
const {
    handleEventGetById,
    handleEventGetAll,
    handleEventRegistration,
    handleEventDelete
} = require('../controllers/eventParticipants/eventParticipantsController');

const EventParticipantValidator = require('../middlewares/EventParticipantsValidator');
const router = Router();

router.get('/', authenticate, handleEventGetAll);