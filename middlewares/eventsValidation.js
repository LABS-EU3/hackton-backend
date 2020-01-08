const db = require('../controllers/events/eventsModel');

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
  // checks that the description, title and guidelines have more that 50 characters.
  const eventDescription = req.body.event_description.split('');
  const eventGuidelines = req.body.guidelines.split('');
  const eventTitle = req.body.event_title.split('');
  if (
    eventDescription.length >= 50 &&
    eventGuidelines.length >= 50 &&
    eventTitle.length >= 10
  ) {
    next();
  } else {
    res.status(400).json({
      error:
        'Please provide an event description and guidelines of 50 characters or more. The event title should be atleast 10 characters'
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

module.exports = {
  validateID,
  ValidateEvent,
  validateCharacterLength,
  validateParticipationType,
  validateDuplicateValues
};
