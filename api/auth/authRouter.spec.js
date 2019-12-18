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
  // await db("event_categories").del();
  // await db("events").del();
  // await db("users").del();

  //   const a = await request(server)
  //     .post("/api/auth/register")
  //     .send(addUser);

  //   token = res.body.token;
  //   console.log(token);
});

describe('api/auth/* endpoints', () => {
  describe('[POST] /api/auth', () => {
    test('should return 201 Created', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(addUser);
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(addUser.email);
      expect(response.body.user.bio).toBe(addUser.bio);
      expect(response.body.user.username).toBe(addUser.username);
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
