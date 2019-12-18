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
//   test('[POST] /events', async () => {
//     const response = await request(server)
//       .post('/api/auth/login')
//       .send(addUser);
//     token = response.body.token;
//     const response2 = await request(server)
//       .post('/api/event-category')
//       .set('authorization', token)
//       .send({ category_name: 'Lambda winter hackathon' });
//     expect(response2.status).toBe(201);
//     const response3 = await request(server)
//       .post('/api/events')
//       .set('authorization', token)
//       .send({
//         event_title: 'Winter hackathon 2019',
//         event_description: "Lambda's winter hackathon",
//         creator_id: 1,
//         start_date: startDate,
//         end_date: endDate,
//         location: 'remote',
//         guidelines: 'Be human',
//         participation_type: 'both',
//         category_id: 1
//       });
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
});
