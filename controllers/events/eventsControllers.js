/* eslint-disable no-use-before-define */
const moment = require('moment');
const db = require('./eventsModel');

function handleEventsGetByUSerId(req, res) {
  const userId = req.decodedToken.subject;
  db.getByUserId(userId)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
}

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
  const userId = req.decodedToken.subject;
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
    creator_id: userId,
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
  const userId = req.decodedToken.subject;
  const event = {
    event_title: req.body.event_title,
    event_description: req.body.event_description,
    creator_id: userId,
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

module.exports = {
  handleEventsGetByUSerId,
  handleEventGetById,
  handleEventsDelete,
  handleEventsEdit,
  handleEventsPost,
  handleEventsGet
};
