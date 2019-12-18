const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  username: 'test',
  password: 'test',
  bio: 'I am a robot',
  email: 'test@email.com',
  fullname: 'tests tests'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,events, users CASCADE');
});

describe('api/auth/* endpoints', () => {
  describe('[POST] /api/auth', () => {
    test('should return 201 Created', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(addUser);
      expect(response.status).toBe(201);
      expect(response.body.user.email).toEqual(addUser.email);
      expect(response.body.user.bio).toEqual(addUser.bio);
      expect(response.body.user.username).toEqual(addUser.username);
      console.log(response.body.user, '*******My log********');
    });

    test('Email is required', async () => {
      const userCopy = { ...addUser };
      delete userCopy.email;

      const response = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(response.status).toBe(400);
    });

    test('Password is required', async () => {
      const userCopy = { ...addUser };
      delete userCopy.password;

      const response = await request(server)
        .post('/api/auth/register')
        .send(userCopy);

      expect(response.status).toBe(400);
    });

    test('should return a token', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(addUser);
      expect(response.body.token).not.toBe(undefined);
    });
  });
});
