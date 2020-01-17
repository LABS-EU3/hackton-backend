const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');
const mockUsers = require('../../data/mock/auth.mock');

let token;

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE users CASCADE');
  const response1 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(mockUsers.validInput1);
  const response2 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(mockUsers.validInput2);
  const response3 = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(mockUsers.validInput3);
  const response = await request(server)
    .post('/api/auth/login')
    .send(mockUsers.validInput1);
  token = response.body.body.token;
});

describe('user can get all users', () => {
  test('user can [GET] all users', async done => {
    // logged in user can successfully fetch a user `
    const response = await request(server)
      .get('/api/users')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    done();
  });
});
