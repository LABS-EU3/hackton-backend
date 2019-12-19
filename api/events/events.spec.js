const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');
const moment = require('moment');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test'
};

const startDate = moment('12/23/2019').format();
const endDate = moment('03/01/2020').format();

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
  const response = await request(server)
    .post('/api/auth/register')
    .send(addUser);
});

describe('user can add/edit/delete/get an event', () => {
  test('[POST] /events', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const { userId } = response.body;
    const response5 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    let categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    console.log(response3.body);
    expect(response3.status).toBe(201);
  });
  test('[GET] /events', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .get('/api/events')
      .set('authorization', token);
    expect(response3.status).toBe(200);
  });
  test('[PUT] /events', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const { userId } = response.body;
    const response5 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    let categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    let eventId = response3.body.event_id;
    const response4 = await request(server)
      .put(`/api/events/${eventId}`)
      .set('authorization', token)
      .send({
        event_title: 'NaijaHacks 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    console.log(response4.body);
    expect(response4.status).toBe(201);
  });
  test('[DELETE] /events', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const { userId } = response.body;
    const response5 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    let categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    let eventId = response3.body.event_id;
    const response4 = await request(server)
      .delete(`/api/events/${eventId}`)
      .set('authorization', token);
    console.log(response4.body);
    expect(response4.status).toBe(200);
  });
  test('[PUT] /events will fail if event object is missing a property', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const { userId } = response.body;
    const response5 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    let categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    let eventId = response3.body.event_id;
    const response4 = await request(server)
      .put(`/api/events/${eventId}`)
      .set('authorization', token)
      .send({
        event_title: 'NaijaHacks 2019',
        event_description: "Lambda's winter hackathon",
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'Be human',
        participation_type: 'both',
        category_id: categoryId
      });
    console.log(response4.body);
    expect(response4.status).toBe(201);
  });
});
