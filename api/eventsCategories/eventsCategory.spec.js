const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test'
};

beforeAll(async () => {
  await db('event_categories').delete();
  await db('users').delete();
  await db('events').delete();
  const response = await request(server)
    .post('/api/auth/register')
    .send(addUser);
});

describe('user can add/edit/delete/get an event category', () => {
  test('[POST] /event-category', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    console.log(response3.body);
    expect(response3.status).toBe(201);
  });
  test('[GET] /event-category', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .get('/api/event-category')
      .set('authorization', token);
    console.log(response3.body);
    expect(response3.status).toBe(200);
  });
});
