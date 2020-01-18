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
    expect(response.body.message).toEqual('Users fetched successfully');
    done();
  });
  test('user can [GET] a single user by email', async done => {
    const response = await request(server)
      .get('/api/users/search')
      .set('Authorization', token)
      .send({ email: mockUsers.validInput2.email });
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('User fetched successfully');
    done();
  });
  test('user can [GET] a single user by id', async done => {
    const response = await request(server)
      .get('/api/users/search')
      .set('Authorization', token)
      .send({ email: mockUsers.validInput2.email });
    const userId = response.body.body.user.id;

    const response2 = await request(server)
      .get(`/api/users/${userId}`)
      .set('Authorization', token);
    expect(response2.status).toBe(200);
    expect(response2.body.message).toEqual('User fetched successfully');
    done();
  });
});
