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
  validateID,
  ValidateEvent,
  validateCharacterLength,
  validateParticipationType,
  validateDuplicateValues
} = require('../middlewares/eventsValidation');
const eventsObjectValidator = require('../utils/eventsValidator');

const router = Router();

router.post(
  '/',
  authenticate,
  validateDuplicateValues,
  eventsObjectValidator,
  validateCharacterLength,
  validateParticipationType,
  handleEventsPost
);
router.get('/', authenticate, handleEventsGet);
router.get('/your-events', authenticate, handleEventsGetByUSerId);
router.put(
  '/:id',
  authenticate,
  eventsObjectValidator,
  validateID,
  ValidateEvent,
  validateCharacterLength,
  validateParticipationType,
  handleEventsEdit
);
router.delete(
  '/:id',
  authenticate,
  validateID,
  ValidateEvent,
  handleEventsDelete
);
router.get('/:id', authenticate, validateID, ValidateEvent, handleEventGetById);

module.exports = router;
