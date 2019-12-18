/* eslint-disable no-use-before-define */
const express = require('express');
const db = require('./eventsModel');
const authenticate = require('../auth/authenticate');
const moment = require('moment');

const router = express.Router();

router.post('/', authenticate, handleEventsPost);
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
  const editedEvent = req.body;
  const editedStartDate = moment(req.body.start_date).format();
  const editedEndDate = moment(req.body.end_date).format();
  editedEvent.start_date = editedStartDate;
  editedEvent.end_date = editedEndDate;
  db.update(id, editedEvent)
    .then(() => {
      res.status(201).json({ message: 'your event was edited successfully!' });
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
    });
}

function handleEventsPost(req, res) {
  const event = req.body;
  const startDate = moment(req.body.start_date).format();
  const endDate = moment(req.body.end_date).format();
  event.start_date = startDate;
  event.end_date = endDate;
  db.add(event)
    .then(() => {
      res.status(201).json({ message: 'your event was added successfully!' });
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
