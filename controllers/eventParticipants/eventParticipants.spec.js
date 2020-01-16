const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;
let eventId;
const invalidId = '849612';
const addUser = {
  email: 'test@mail.com',
  password: 'testingtesting'
};

const newEvent = {
  event_title: 'Test Hackathon',
  start_date: '2019-12-23',
  end_date: '2019-12-23',
  event_description:
    'A test for backend It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of  (The Extremes of Good and Evil) by Cicero, written in 45 BC. Thpk;lis book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum',
  location: 'Remotes',
  guidelines:
    'Run yarn or npm test. Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 200lj0 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 ofhe Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum',
  participation_type: 'team',
  category_id: 1
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE users, events CASCADE');
  const response = await request(server)
    .post('/api/auth/register')
    .send(addUser);

  const response2 = await request(server)
    .post('/api/auth/login')
    .send(addUser);
  token = response2.body.body.token;

  const eventCreation = await request(server)
    .post('/api/events')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send(newEvent);
  eventId = await eventCreation.body.body.event_id;
});

describe('Event participants endpoints', () => {
  test('user can register as a participant for an event', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token);

    expect(eventRegister.status).toBe(201);
    expect(eventRegister.statusCode).toBe(201);
    expect(eventRegister.body.success).toEqual(true);
    expect(eventRegister.body.message).toEqual('Event registered successfully');
  });

  test('user cannot register as a participant for an invalid event (post)', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/3/participants`)
      .set('Authorization', token);

    expect(eventRegister.status).toBe(404);
    expect(eventRegister.statusCode).toBe(404);
    expect(eventRegister.body.success).toEqual(false);
    expect(eventRegister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
  });

  test('organizer can get all participants for an event by logging in with correct credentials', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token);

    const allParticipants = await request(server)
      .get(`/api/events/${eventId}/participants`)
      .set('Authorization', token);
    expect(allParticipants.status).toBe(200);
    expect(allParticipants.statusCode).toBe(200);
    expect(allParticipants.body.success).toEqual(true);
    expect(allParticipants.body.message).toEqual(
      'Participant(s) retrieved successfully'
    );
  });

  test('organizer cannot get all participants for by providing invalid event id', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/1/participants`)
      .set('Authorization', token);

    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token);
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
  });

  test('user cannot register for invalid event (get)', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/1/participants`)
      .set('Authorization', token);

    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token);
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
  });

  test('user cannot get events he didnt register for', async () => {
    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token);
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
  });

  test('user can unregister as a participant for an event', async () => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      expect(eventRegister.status).toBe(201)

    const eventUnregister = await request(server)
      .delete(`/api/events/${eventId}/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
    expect(eventUnregister.status).toBe(200);
    expect(eventUnregister.statusCode).toBe(200);
    expect(eventUnregister.body.success).toEqual(true);
    expect(eventUnregister.body.message).toEqual('Event deleted successfully')
  })

  test('user can not unregister as a participant for an event he didnt register for', async () => {
    const eventUnregister = await request(server)
      .delete(`/api/events/2/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual('This event id cannot be found,please provide a valid event id');
  });

  test('user can not unregister as a participant for an invalid event', async () => {
    const eventUnregister = await request(server)
      .delete(`/api/events/${invalidId}/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual('This event id cannot be found,please provide a valid event id');
  });
});