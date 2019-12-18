const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test'
};

beforeAll(async () => {
  await db('event_categories').delete();
  await db('users').delete();
  await db('events').delete();
  const response = await request(server)
    .post('/api/auth/register')
    .send(addUser);
});

describe('user can add/edit/delete/get an event', () => {
  //   test('[POST] /events', async () => {
  //     const response = await request(server)
  //       .post('/api/auth/login')
  //       .send(addUser);
  //     token = response.body.token;
  //     const response3 = await request(server)
  //       .post('/api/events')
  //       .set('authorization', token)
  //       .send({
  //         event_title: 'Winter hackathon 2019',
  //         event_description: "Lambda's winter hackathon",
  //         creator_id: 1,
  //         start_date: '23/12/2019',
  //         end_date: '3/01/2019',
  //         location: 'remote',
  //         guidelines: 'Be human',
  //         participation_type: 'both',
  //         category_id: 3
  //       });
  //     console.log(response3.body);
  //     expect(response3.status).toBe(201);
  //   });
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
});
