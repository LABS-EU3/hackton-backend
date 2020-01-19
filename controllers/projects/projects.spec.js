const request = require('supertest');
const moment = require('moment');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  email: 'test6@email.com',
  password: 'test1234'
};

const startDate = moment(new Date('2019-12-23'), 'MMM D LTS').format();
const endDate = moment(new Date('2020-01-03'), 'MMM D LTS').format();

beforeEach(async () => {
  await db.raw(
    'TRUNCATE TABLE event_categories,users,events,project_requirements,project_entries CASCADE'
  );
  // eslint-disable-next-line no-unused-vars
  const response = await request(server)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(addUser);
  token = response.body.body.token;
});

describe('user can add an event and  post event project requirements, event participant can submit a project', () => {
  test('organizer can [POST] project requirements, participants can submit projects', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ category_name: 'Science Winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        event_title: 'The Scientist hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const response2 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/requirements`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        video_url: 'false',
        project_writeup: 'false',
        git_url: 'true'
      });
    expect(response2.status).toBe(201);
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        git_url: 'https://github.com/LABS-EU3/hackton-backend',
        project_title: 'The Road Not Taken is Somewhere Here',
        participant_or_team_name: 'Furahi Day'
      });
    expect(response7.status).toBe(201);
  });
  test('organizer can [PUT] project requirements, participants can [PUT] projects', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ category_name: 'Science Winter hackathon' });
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        event_title: 'The Scientist hackathon 2019',
        event_description:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        start_date: startDate,
        end_date: endDate,
        location: 'remote',
        guidelines:
          'A hackathon (also known as a hack day, hackfest or codefest) is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including domain experts, collaborate intensively on software',
        participation_type: 'both',
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const response2 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/requirements`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        video_url: 'false',
        project_writeup: 'false',
        git_url: 'true'
      });
    expect(response2.status).toBe(201);
    const Ids = {
      eventId: 1,
      requirementsId: 1
    };
    console.log("response 2 body",response2.body.body);
    response2.body.body.map(project => {
      Ids.eventId = project.event_id;
      Ids.requirementsId = project.id;
      return Ids;
    });
    console.log('Ids ==>', Ids);
    const response8 = await request(server)
      .put(`/api/events/projects/requirements/${Ids.requirementsId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        video_url: 'true',
        project_writeup: 'true',
        git_url: 'true',
        event_id: Ids.eventId
      });
    expect(response8.status).toBe(201);
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        video_url:
          'https://www.youtube.com/watch?v=yfn9E8I-ad4&list=PLMf7VY8La5REXhuUzK3g-9Fr_bf0yBarA&index=5',
        git_url: 'https://github.com/LABS-EU3/hackton-backend',
        project_writeup:
          'Two roads diverged in a yellow wood,And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth',
        project_title: 'The Road Not Taken is Somewhere Here',
        participant_or_team_name: 'Furahi Day'
      });
    expect(response7.status).toBe(201);
    const submittedIds = {
      eventId: 1,
      projectId: 1
    };
    response7.body.body.map(project => {
      submittedIds.eventId = project.event_id;
      submittedIds.projectId = project.id;

      return submittedIds;
    });
    const response9 = await request(server)
      .put(`/api/events/projects/submissions/${submittedIds.projectId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        video_url:
          'https://www.youtube.com/watch?v=yfn9E8I-ad4&list=PLMf7VY8La5REXhuUzK3g-9Fr_bf0yBarA&index=5',
        git_url: 'https://github.com/LABS-EU3/hackton-backend',
        project_writeup:
          'Two roads diverged in a yellow wood,And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth',
        project_title: 'The Road Not Taken is Somewhere Here Edited',
        participant_or_team_name: 'Furahi Day',
        event_id: submittedIds.eventId
      });
    expect(response9.status).toBe(201);
  });
});
