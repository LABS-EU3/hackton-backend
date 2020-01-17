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
const EventValidator = require('../middlewares/EventValidator');
const {
  handleEventsGetById,
  handleEventRegistration,
  handleEventDelete
} = require('../controllers/eventParticipants/eventParticipantsController');

const {
  handleprojectsReqPost,
  handleprojectsReqEdit,
  handleGetProjectReqById,
  handlePRojectReqDelete,
  handleprojectEntriesPost,
  handleGetAllProjectEntries
} = require('../controllers/projects/projectControllers');

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

// Events participants endpoints

router.get(
  '/:id/participants',
  authenticate,
  EventValidator.validateID,
  handleEventsGetById
);

router.post(
  '/:id/participants',
  authenticate,
  EventValidator.validateID,
  handleEventRegistration
);

router.delete(
  '/:id/participants',
  authenticate,
  EventValidator.validateID,
  handleEventDelete
);

// Events projects requirements endpoints
router.post(
  '/:id/projects/requirements',
  authenticate,
  EventValidator.validateID,
  handleprojectsReqPost
);
router.get(
  '/:id/projects/requirements',
  authenticate,
  EventValidator.validateID,
  handleGetProjectReqById
);
router.put(
  '/projects/requirements/:id',
  authenticate,
  EventValidator.validateID,
  handleprojectsReqEdit
);
router.delete(
  '/projects/requirements/:id',
  authenticate,
  EventValidator.validateID,
  handlePRojectReqDelete
);

// Events projects entries endpoints
router.post(
  '/:id/projects/submissions',
  authenticate,
  EventValidator.validateID,
  handleprojectEntriesPost
);

router.get(
  '/:id/projects/submissions',
  authenticate,
  EventValidator.validateID,
  handleGetAllProjectEntries
);

module.exports = router;
