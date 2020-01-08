const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

const addUser = {
  username: 'test',
  password: 'test',
  bio: 'I am a robot',
  email: 'test@email.com',
  fullname: 'tests tests'
};

const loginUser = {
  password: 'test',
  email: 'test@email.com'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,events, users CASCADE');
});

describe('api/auth/* endpoints', () => {
  describe('[POST] /api/auth', () => {
    test('should return 201 Created', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(addUser);
      expect(response.status).toBe(201);
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

  describe('[POST] /api/auth', () => {
    test('should return 200 OK', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(addUser);

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginUser);
      expect(response.status).toBe(200);
    });

    test('Email is required', async () => {
      const userCopy = { ...addUser };
      delete userCopy.email;

      await request(server)
        .post('/api/auth/register')
        .send(addUser);

      const response = await request(server)
        .post('/api/auth/login')
        .send(userCopy);

      expect(response.status).toBe(400);
    });

    test('Password is required', async () => {
      const userCopy = { ...addUser };
      delete userCopy.password;

      await request(server)
        .post('/api/auth/register')
        .send(addUser);

      const response = await request(server)
        .post('/api/auth/login')
        .send(userCopy);

      expect(response.status).toBe(400);
    });

    test('should return a token', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(addUser);

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginUser);
      expect(response.body.token).not.toBe(undefined);
    });
  });
});
