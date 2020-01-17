const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');
const mockUsers = require('../../data/mock/auth.mock');
const mockEvents = require('../../data/mock/event.mock');

const app = request(server);
let token;
let token2;
let eventId;
let teamMateId;
// let wrongToken;

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE users, events CASCADE');
  const response1 = await app
    .post('/api/auth/register')
    .send(mockUsers.validInput1);
  const response2 = await app
    .post('/api/auth/register')
    .send(mockUsers.validInput2);
  const response3 = await app
    .post('/api/auth/register')
    .send(mockUsers.validInput3);
  const response = await app
    .post('/api/auth/login')
    .send(mockUsers.validInput1);
  token = response.body.body.token;
  const response4 = await app
    .post('/api/auth/login')
    .send(mockUsers.validInput2);
  token2 = response4.body.body.token;

  const eventCreation = await request(server)
    .post('/api/events')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send(mockEvents.newEvent);
  eventId = await eventCreation.body.body.event_id;

  const seedTeam = await app
    .post(`/api/events/${eventId}/team`)
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send({ email: mockUsers.validInput3.email, role_type: 'organizer' });
  teamMateId = seedTeam.body.body.member.user_id;
});

describe('[POST] user as event owner can ADD/GET/DELETE team members to their event', () => {
  test('event owner can add team mates', async done => {
    const response = await app
      .post(`/api/events/${eventId}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ email: mockUsers.validInput2.email, role_type: 'judge' });
    expect(response.status).toEqual(200);
    done();
  });
  test('[POST] event owner can not add a person that is already in the team', async done => {
    const response = await app
      .post(`/api/events/${eventId}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ email: mockUsers.validInput3.email, role_type: 'judge' });
    expect(response.status).toEqual(409);
    done();
  });
  test('[POST] none owner can not add a person the team', async done => {
    const response = await app
      .post(`/api/events/${eventId}/team`)
      .set('Authorization', token2)
      .set('Content-Type', 'application/json')
      .send({ email: mockUsers.validInput3.email, role_type: 'judge' });
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(
      'You are not authorized to access to do this!'
    );
    done();
  });
  test('[GET] logged in users can get all users in their team', async done => {
    const response = await app
      .get(`/api/events/${eventId}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(200);
    done();
  });
  test('[DELETE] event owner can delete a person that is already in the team', async done => {
    const response = await app
      .delete(`/api/events/${eventId}/team/${teamMateId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(200);
    done();
  });
  test('[DELETE] none owner can not delete a person that is in a team', async done => {
    const response = await app
      .delete(`/api/events/${eventId}/team/${teamMateId}`)
      .set('Authorization', token2)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(
      'You are not authorized to access to do this!'
    );
    done();
  });
});
