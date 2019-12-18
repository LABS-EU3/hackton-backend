const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
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
    expect(response3.status).toBe(200);
  });
  test('[PUT] /event-category', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    let categoryId = response3.body.category_id;
    const response4 = await request(server)
      .put(`/api/event-category/${categoryId}`)
      .set('authorization', token)
      .send({ category_name: 'Kenya Innovation hackathon' });
    expect(response4.status).toBe(201);
  });
  test('[DELETE] /event-category', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    let categoryId = response3.body.category_id;
    const response4 = await request(server)
      .delete(`/api/event-category/${categoryId}`)
      .set('authorization', token);
    expect(response4.status).toBe(200);
  });
});
