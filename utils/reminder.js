/* eslint-disable camelcase */
const cron = require('node-cron');
const eventsDb = require('../models/eventsModel');
const participantDb = require('../models/eventParticipantsModel');
const { usersToken } = require('../utils/generateToken');
const Mailer = require('../utils/mailHandler');

const setReminder = async () => {
  const events = await eventsDb.find();
  events.forEach(async event => {
    const paricipants = await participantDb.getByEventId(event.id);
    paricipants.forEach(async ele => {
      if (ele.event_id === event.id) {
        const {
          user_id,
          participants_email,
          participants_name,
          participants_username
        } = ele;
        const day = Number(event.start_date.split('-')[2] - 3);
        const month = event.start_date.split('-')[1];
        // const eta = day;
        const token = usersToken({ user_id, participants_email });
        console.log(participants_email, '==email==')
        const template = await Mailer.generateMailTemplate({
          receiverName: participants_email,
          intro: 'Hackathon Reminder',
          text: 'The hackathon starts soon. Are you ready!!!',
          actionBtnText: 'View Event',
          actionBtnLink: `${process.env.REDIRECT_URL}/info/${token}`
        });

        cron.schedule(`1 * * * * *`, async () => {
          Mailer.createMail({
            to: participants_email,
            message: template,
            subject: 'Event Reminder'
          });
        });
      }
    });
  });
};

module.exports = setReminder;
