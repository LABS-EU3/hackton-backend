const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test2@email.com',
  password: 'test1234'
};
const secondUser = {
    email:"test2@email.com",
    password:"test2345"
}


beforeEach(async () => {
    await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
    // eslint-disable-next-line no-unused-vars
    const response = await request(server) // creates new user before each test
      .post('/api/auth/register')
      .send(addUser);
  });

describe('user can add/get team members to an event', () => {
    test('user can [GET] /:id/team', async () => {
        // logged in user can successfully get an event category
        const response = await request(server)
          .post('/api/auth/login')
          .send(addUser);
        token = response.body.body.token;
        const response3 = await request(server)
          .get('/api/:id/team')
          .set('Authorization', token);
        expect(response3.status).toBe(200);
      });
// register 3 users , signin the first(event created) and second user, get request from other users and add them.

      test('[POST] will fail is event id does not exist', async () => {
        const response = await request(server)
          .post('/api/auth/login')
          .send(addUser);
        token = response.body.body.token;
        const response5 = await request(server)
          .post('/api/:id/team')
          .set('Authorization', token)
          .send();
        
      });

});
  