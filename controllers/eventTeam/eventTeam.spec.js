const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test1@email.com',
  password: 'test1234'
};
const secondUser = {
  email: 'test2@email.com',
  password: 'test2345'
};
const thirdUser = {
  email: 'test3@email.com',
  password: 'test3456'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
  const response1 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(addUser);
  const response2 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(secondUser);
  const response3 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(thirdUser);
});

describe('user can add/get team members to an event', () => {
  test.only('user can [GET] api/users', async () => {
    // logged in user can successfully fetch a user `
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.body.token;
    const response4 = await request(server)
      .get('/api/users')
      .set('Authorization', token);
    expect(response4.status).toBe(200);
  });
  // test.only('user can [POST] /events/:id/team', async () => {
  //   // logged in user can successfully fetch a user `
  //   const response1 = await request(server)
  //     .post('/api/auth/login')
  //     .send(addUser);
  //   token = response1.body.body.token;
  //   const response3 = await request(server)
  //     .get('/api/event/:id/team')
  //     .set('Authorization', token);
  //   expect(response3.status).toBe(200);
  // });
  // test('user can [GET] /events/:id/team', async () => {
  //   // logged in user can successfully fetch a user `
  //   const response = await request(server)
  //     .post('/api/auth/login')
  //     .send(addUser);
  //   token = response.body.body.token;
  //   const response3 = await request(server)
  //     .get('/api/events/:id/team')
  //     .set('Authorization', token)
  //   expect(response3.status).toBe(200);
  // });
});
