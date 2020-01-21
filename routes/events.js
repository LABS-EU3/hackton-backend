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
  handleGetTeamMembers,
  handleDeleteTeamMember
} = require('../controllers/eventTeam/eventTeamController');
const EventValidator = require('../middlewares/EventValidator');
const {
  handleEventsGetById,
  handleEventRegistration,
  handleEventDelete
} = require('../controllers/eventParticipants/eventParticipantsController');

const {
  handleprojectEntriesPost,
  handleGetAllProjectEntries,
  handleGetProjectEntry,
  handleProjectEntriesEdit,
  handleProjectEntriesDelete
} = require('../controllers/projects/projectControllers');

const {
  handleprojectGradingPost,
  handleProjectGradingEdit,
  handleGetAllProjectGrading,
  handleGetProjectGrading,
  handleProjectGradingDelete
} = require('../controllers/projectGrading/projectGradingControllers');

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
  EventValidator.checkEventOwner,
  EventValidator.teamValidation,
  handleAddTeamMember
);

router.delete(
  '/:id/team/:teammate_id',
  authenticate,
  EventValidator.validateID,
  EventValidator.checkEventOwner,
  handleDeleteTeamMember
);

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

router.get('/projects/submissions/:id', authenticate, handleGetProjectEntry);

router.put('/projects/submissions/:id', authenticate, handleProjectEntriesEdit);

router.delete(
  '/projects/submissions/:id',
  authenticate,
  EventValidator.checkEventOwner,
  handleProjectEntriesDelete
);

// Project Grading

router.post(
  '/projects/submissions/:id/grading',
  authenticate,
  handleprojectGradingPost
);

router.put(
  '/projects/submissions/:id/grading',
  authenticate,
  handleProjectGradingEdit
);

router.get(
  '/projects/submissions/:id/grading',
  authenticate,
  handleGetProjectGrading
);
router.get('/:id/projects/grading', authenticate, handleGetAllProjectGrading);
router.delete(
  '/projects/submissions/:id/grading',
  authenticate,
  handleProjectGradingDelete
);

module.exports = router;
