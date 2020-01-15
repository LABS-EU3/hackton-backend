const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@mail.com',
  password: 'test'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories, users, events CASCADE');
  const response = await request(server)
    .post('/api/auth/register')
    .send(addUser);
});

