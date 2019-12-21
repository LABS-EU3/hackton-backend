const request = require('supertest');
const moment = require('moment');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test@email.com',
  password: 'test'
};

const startDate = moment(new Date('2019-12-23'), 'MMM D LTS').format();
const endDate = moment(new Date('2020-01-03'), 'MMM D LTS').format();

beforeEach(async () => {
  await db.raw('TRUNCATE TABLE event_categories,users, events CASCADE');
  // eslint-disable-next-line no-unused-vars
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
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });

    expect(response3.status).toBe(201);
  });
  test('[GET] /events', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const response3 = await request(server)
      .get('/api/events')
      .set('Authorization', token);
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
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const eventId = response3.body.event_id;
    const response4 = await request(server)
      .put(`/api/events/${eventId}`)
      .set('Authorization', token)
      .send({
        event_title: 'NaijaHacks 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
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
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const eventId = response3.body.event_id;
    const response4 = await request(server)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', token);
    expect(response4.status).toBe(200);
  });
  test('[POST] /events will fail if event description or guidelines is missing a property', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(addUser);
    token = response.body.token;
    const { userId } = response.body;
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .send({ category_name: 'Lambda winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(400);
  });
  test('[POST] /events will fail if event descriptions and guidelines is less than 150 characters', async () => {
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
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'W',
        event_description: 'A hackathon',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines: 'A hackathon',
        participation_type: 'both',
        category_id: categoryId
      });

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual({
      error:
        'Please provide an event description and guidelines of 150 characters or more. The event title should be atleast 10 characters'
    });
  });
  test('[POST] /events will fail if participation type is not individual,team or both', async () => {
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
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'easy',
        category_id: categoryId
      });

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual({
      message:
        "please pick between these three options for participation type ['individual','team','both'] "
    });
  });
  test('[POST] /events will fail if event title already exists in the database', async () => {
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
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });

    expect(response3.status).toBe(201);
    const response4 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });

    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual({
      message:
        'This event title already exists in the database, please pick a new event title!'
    });
  });
  test('[GET] /events/your-events for each logged in user', async () => {
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
    const categoryId = response5.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('authorization', token)
      .send({
        event_title: 'Winter hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        creator_id: userId,
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const response4 = await request(server)
      .get('/api/events/your-events')
      .set('authorization', token);
    expect(response4.status).toBe(200);
  });
});
