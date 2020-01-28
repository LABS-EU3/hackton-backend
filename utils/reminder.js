const cron = require('node-cron');
const nodeMailer = require('nodemailer');
const eventsDb = require('../models/eventsModel');

const setReminder = async () => {
  const events = await eventsDb.find();
  const eventDates = await events.map(event => event.start_date);
  console.log(eventDates);

  cron.schedule('* * * * * *', async () => {
    console.log(`The hackathon starts ${eventDates[0]}`);
  });
};

module.exports = setReminder;
