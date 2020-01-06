function eventsObjectValidator(req, res, next) {
  // function to validate events object properties
  if (Object.keys(req.body).length) {
    if (
      req.body.event_title &&
      req.body.event_description &&
      req.body.start_date &&
      req.body.end_date &&
      req.body.location &&
      req.body.guidelines &&
      req.body.participation_type &&
      req.body.category_id
    ) {
      next();
    } else {
      res.status(400).json({
        message: 'missing required field'
      });
    }
  } else {
    res.status(400).json({
      message: 'missing required data'
    });
  }
}

module.exports = eventsObjectValidator;
