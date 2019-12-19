/* eslint-disable no-use-before-define */
const express = require('express');
const db = require('./eventsModel');
const authenticate = require('../auth/authenticate');
const moment = require('moment');
const eventsObjectValidator = require('../../utils/eventsValidator');

const router = express.Router();

router.post('/', authenticate, eventsObjectValidator, handleEventsPost);
router.get('/', authenticate, handleEventsGet);
router.put('/:id', authenticate, validateID, ValidateEvent, handleEventsEdit);
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
  const editedStartDate = moment(req.body.start_date).format();
  const editedEndDate = moment(req.body.end_date).format();
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
  const startDate = moment(req.body.start_date).format();
  const endDate = moment(req.body.end_date).format();
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

function validateID(req, res, next) {
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

module.exports = router;
