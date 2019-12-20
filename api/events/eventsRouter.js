/* eslint-disable no-use-before-define */
const express = require('express');
const moment = require('moment');
const db = require('./eventsModel');
const authenticate = require('../auth/authenticate');
const eventsObjectValidator = require('../../utils/eventsValidator');

const router = express.Router();

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

function handleEventGetById(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleEventsDelete(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(() => {
      res.status(200).json({ message: 'your event was deleted successfully!' });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleEventsEdit(req, res) {
  const { id } = req.params;
  const editedStartDate = moment(
    new Date(req.body.start_date),
    'MMM D LTS'
  ).format();
  const editedEndDate = moment(
    new Date(req.body.end_date),
    'MMM D LTS'
  ).format();
  const editedEvent = {
    event_title: req.body.event_title,
    event_description: req.body.event_description,
    creator_id: req.body.creator_id,
    start_date: editedStartDate,
    end_date: editedEndDate,
    location: req.body.location,
    guidelines: req.body.guidelines,
    participation_type: req.body.participation_type,
    category_id: req.body.category_id
  };

  db.update(id, editedEvent)
    .then(() => {
      res.status(201).json({ message: 'your event was edited successfully!' });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleEventsPost(req, res) {
  const startDate = moment(new Date(req.body.start_date), 'MMM D LTS').format();
  const endDate = moment(new Date(req.body.end_date), 'MMM D LTS').format();

  const event = {
    event_title: req.body.event_title,
    event_description: req.body.event_description,
    creator_id: req.body.creator_id,
    start_date: startDate,
    end_date: endDate,
    location: req.body.location,
    guidelines: req.body.guidelines,
    participation_type: req.body.participation_type,
    category_id: req.body.category_id
  };

  db.add(event)
    .then(data => {
      res.status(201).json({
        message: `your event was added successfully!`,
        event_id: Number(data.toString())
      });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleEventsGet(req, res) {
  db.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

// validators

function validateID(req, res, next) {
  // validates provided ID is a number
  const { id } = req.params;
  if (Number(id)) {
    next();
  } else {
    res
      .status(400)
      .json({ Error: 'Please provide a valid id,an id can only be a number' });
  }
}

function ValidateEvent(req, res, next) {
  // validates the provided Id exists in the db
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({
          ErrorMessage:
            'This event id cannot be found,please provide a valid event id'
        });
      } else {
        req.event = data;
        next();
      }
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
}

function validateCharacterLength(req, res, next) {
  // checks that the description and guidelines have more that 150 characters.
  const eventDescription = req.body.event_description.split('');
  const eventGuidelines = req.body.guidelines.split('');
  if (eventDescription.length >= 150 && eventGuidelines.length >= 150) {
    next();
  } else {
    res.status(400).json({
      error:
        'Please provide an event description and guidelines of 150 characters or more'
    });
  }
}

function validateParticipationType(req, res, next) {
  // checks that the participation type is  individual,team or both
  const eventParticipation = req.body.participation_type;
  if (
    eventParticipation === 'individual' ||
    eventParticipation === 'team' ||
    eventParticipation === 'both'
  ) {
    next();
  } else {
    res.status(400).json({
      message:
        "please pick between these three options for participation type ['individual','team','both'] "
    });
  }
}

function validateDuplicateValues(req, res, next) {
  db.findByTitle(req.body.event_title)
    .then(event => {
      if (event.length === 0) {
        next();
      } else {
        res.status(400).json({
          message:
            'This event title already exists in the database, please pick a new event title!'
        });
      }
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
}

module.exports = router;
