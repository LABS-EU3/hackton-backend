/* eslint-disable no-use-before-define */
const { Router } = require('express');
const authenticate = require('../api/auth/authenticate');
const {
  handleEventsGetByUSerId,
  handleEventGetById,
  handleEventsDelete,
  handleEventsEdit,
  handleEventsPost,
  handleEventsGet
} = require('../controllers/events/eventsControllers');
const {
  handleAddTeamMember,
  handleGetTeamMembers
} = require('../controllers/eventTeam/eventTeamController');
const EventValidator = require('../middlewares/EventValidator');

const router = Router();

router.post(
  '/',
  authenticate,
  EventValidator.eventValidation,
  handleEventsPost
);
router.get('/', authenticate, handleEventsGet);
router.get('/your-events', authenticate, handleEventsGetByUSerId);
router.put(
  '/:id',
  authenticate,
  EventValidator.validateID,
  EventValidator.eventValidation,
  handleEventsEdit
);
router.delete(
  '/:id',
  authenticate,
  EventValidator.validateID,
  handleEventsDelete
);
router.get('/:id', authenticate, EventValidator.validateID, handleEventGetById);
router.get(
  '/:id/team',
  authenticate,
  EventValidator.validateID,
  handleGetTeamMembers
);
router.post(
  '/:id/team',
  authenticate,
  EventValidator.validateID,
  handleAddTeamMember
);

module.exports = router;
