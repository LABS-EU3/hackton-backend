/* eslint-disable camelcase */
const cron = require('node-cron');
const eventsDb = require('../models/eventsModel');
const participantDb = require('../models/eventParticipantsModel');
const organizerDb = require('../models/eventTeamModel');
const { usersToken } = require('../utils/generateToken');
const Mailer = require('../utils/mailHandler');

const setReminder = async () => {
  const events = await eventsDb.find();
  events.forEach(async event => {
    const paricipants = await participantDb.getByEventId(event.id);
    const organizers = await organizerDb.getTeam(event.id);
    paricipants.forEach(async ele => {
      if (ele.event_id === event.id) {
        const { user_id, participants_email, participants_name } = ele;
        const day = Number(event.start_date.split('-')[2] - 3);
        const month = event.start_date.split('-')[1];
        const eta = day;
        const eventId = event.id;
        const token = usersToken({ user_id, email: participants_email });
        const template = await Mailer.generateMailTemplate({
          receiverName: participants_name || participants_email,
          intro: 'Hackathon Reminder',
          text: 'The hackathon starts soon. Are you ready!!!',
          actionBtnText: 'View Event',
          actionBtnLink: `${process.env.REDIRECT_URL}/info/${eventId}/${token}`
        });

        cron.schedule(`* * ${eta} ${month} * *`, async () => {
          Mailer.createMail({
            to: participants_email,
            message: template,
            subject: 'Event Reminder'
          });
        });
      }
    });
    organizers.forEach(async ele => {
      if (ele.event_id === event.id) {
        const { user_id, email, username } = ele;
        const day = Number(event.start_date.split('-')[2] - 3);
        const month = event.start_date.split('-')[1];
        const eta = day;
        const eventId = event.id;
        const token = usersToken({ user_id, email });
        const template = await Mailer.generateMailTemplate({
          receiverName: username || email,
          intro: 'Hackathon Reminder',
          text: 'The hackathon starts soon. Are you ready!!!',
          actionBtnText: 'View Event',
          actionBtnLink: `${process.env.REDIRECT_URL}/info/${eventId}/${token}`
        });

        cron.schedule(`* * ${eta} ${month} * *`, async () => {
          Mailer.createMail({
            to: username || email,
            message: template,
            subject: 'Event Reminder'
          });
        });
      }
    })
  });
};

module.exports = setReminder;
