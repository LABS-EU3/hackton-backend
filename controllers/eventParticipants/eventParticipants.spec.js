const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');
const mockEvents = require('../../data/mock/event.mock');
const mockUsers = require('../../data/mock/auth.mock');

let token;
let eventId;
const invalidId = '849612';

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE users, events CASCADE');
  const response = await request(server)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(mockUsers.validInput1);
  token = response.body.body.token;

  const eventCreation = await request(server)
    .post('/api/events')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send(mockEvents.newEvent);
  eventId = await eventCreation.body.body.event_id;
  return eventId;
});

describe('Event participants endpoints', () => {
  test('user can register as a participant for an event', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    expect(eventRegister.status).toBe(201);
    expect(eventRegister.statusCode).toBe(201);
    expect(eventRegister.body.success).toEqual(true);
    expect(eventRegister.body.message).toEqual('Event registered successfully');
    done();
  });

  test('user cannot register as a participant for an invalid event (post)', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/3/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    expect(eventRegister.status).toBe(404);
    expect(eventRegister.statusCode).toBe(404);
    expect(eventRegister.body.success).toEqual(false);
    expect(eventRegister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('organizer can get all participants for an event by logging in with correct credentials', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    const allParticipants = await request(server)
      .get(`/api/events/${eventId}/participants`)
      .set('Authorization', token);
    expect(allParticipants.status).toBe(200);
    expect(allParticipants.statusCode).toBe(200);
    expect(allParticipants.body.success).toEqual(true);
    expect(allParticipants.body.message).toEqual(
      'Participant(s) retrieved successfully'
    );
    done();
  });

  test('organizer cannot get all participants for by providing invalid event id', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/1/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('user cannot register for invalid event (get)', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/1/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('user cannot get events he didnt register for', async done => {
    const allParticipants = await request(server)
      .get(`/api/events/1/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(allParticipants.status).toBe(404);
    expect(allParticipants.statusCode).toBe(404);
    expect(allParticipants.body.success).toEqual(false);
    expect(allParticipants.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('user can unregister as a participant for an event', async done => {
    const eventRegister = await request(server)
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventRegister.status).toBe(201);

    const eventUnregister = await request(server)
      .delete(`/api/events/${eventId}/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventUnregister.status).toBe(200);
    expect(eventUnregister.statusCode).toBe(200);
    expect(eventUnregister.body.success).toEqual(true);
    expect(eventUnregister.body.message).toEqual('Event deleted successfully');
    done();
  });

  test('user can not unregister as a participant for an event he didnt register for', async done => {
    const eventUnregister = await request(server)
      .delete(`/api/events/2/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('user can not unregister as a participant for an invalid event', async done => {
    const eventUnregister = await request(server)
      .delete(`/api/events/${invalidId}/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });
});
