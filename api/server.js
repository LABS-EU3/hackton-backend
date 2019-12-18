const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const authRouter = require('../api/auth/authRouter');
const eventsRouter = require('../api/events/eventsRouter');
const eventCategoryRouter = require('../api/eventsCategories/eventCategoryRouter');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/events', eventsRouter);
server.use('/api/event-category', eventCategoryRouter);

server.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Hello from Hackton backend!'
  });
});

server.get('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Invalid route!'
  });
});

module.exports = server;
