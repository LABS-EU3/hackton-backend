const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test1234'
};

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
  // eslint-disable-next-line no-unused-vars
  const response = await request(server) // creates new user before each test
    .post('/api/auth/register')
    .send(addUser);
});

describe('user can add/edit/delete/get an event category', () => {
  test('[POST] /event-category', async () => {
    // logged in user can successfully post an event category
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
  });
  test('[GET] /event-category', async () => {
    // logged in user can successfully get an event category
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .get('/api/event-category')
      .set('Authorization', token);
    expect(response3.status).toBe(200);
  });
  test('[PUT] /event-category', async () => {
    // logged in user can successfully edit an event category
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    const categoryId = response3.body.category_id;
    const response4 = await request(server)
      .put(`/api/event-category/${categoryId}`)
      .set('Authorization', token)
      .send({ category_name: 'Kenya Innovation hackathon' });
    expect(response4.status).toBe(201);
  });
  test('[DELETE] /event-category', async () => {
    // logged in user can successfully delete an event category
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    const categoryId = response3.body.category_id;
    const response4 = await request(server)
      .delete(`/api/event-category/${categoryId}`)
      .set('Authorization', token);
    expect(response4.status).toBe(200);
  });
  test('[PUT] /event-category will fail if ID is not in database', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    const categoryId = response3.body.category_id;
    const response4 = await request(server)
      .put(`/api/event-category/${categoryId + 1}`)
      .set('Authorization', token)
      .send({ category_name: 'Kenya Innovation hackathon' });
    expect(response4.status).toBe(404);
    expect(response4.body).toStrictEqual({
      ErrorMessage:
        'This event category id cannot be found,please provide a valid event category id'
    });
  });
  test('[PUT] /event-category will fail if provided ID is not a number', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    // eslint-disable-next-line no-unused-vars
    const categoryId = response3.body.category_id;
    const response4 = await request(server)
      .put(`/api/event-category/awesomeness`)
      .set('Authorization', token)
      .send({ category_name: 'Kenya Innovation hackathon' });
    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual({
      Error: 'Please provide a valid id,an id can only be a number'
    });
  });
  test('[PUT] /event-category will fail if property provided is wrong', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_names: 'Lambda winter hackathon' });
    expect(response3.status).toBe(500);
  });
  test('[POST] /event-category will fail if category name exists in the DB', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response3.status).toBe(201);
    const response4 = await request(server)
      .post('/api/event-category')
      .set('authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual({
      message:
        'This category name already exists in the database, please pick a new category name!'
    });
  });
});
