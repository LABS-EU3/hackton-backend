const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');
const mockEvents = require('../../data/mock/event.mock');
const mockCategory = require('../../data/mock/categories.mock');
const mockProjects = require('../../data/mock/projects.mock');
const mockUser = require('../../data/mock/auth.mock');

let token;

beforeEach(async () => {
  await db.raw(
    'TRUNCATE TABLE event_categories,users,events,project_entries CASCADE'
  );
  // eslint-disable-next-line no-unused-vars
  const response = await request(server)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(mockUser.validInput1);
  token = response.body.body.token;
});

describe('user can add an event and  post event project requirements, event participant can submit a project', () => {
  test('organizer can [POST] project requirements, participants can submit projects', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockCategory.cat1);
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        ...mockEvents.event1,
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission1);
    expect(response7.status).toBe(201);
  });

  test('organizer can [PUT] project requirements, participants can [PUT] projects', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockCategory.cat1);
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        ...mockEvents.event1,
        category_id: categoryId
      });
    expect(response3.status).toBe(201);
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response9 = await request(server)
      .put(`/api/events/projects/submissions/${projectId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        ...mockProjects.submissionUpdate,
        event_id: response3.body.body.event_id
      });
    expect(response9.status).toBe(201);
    expect(response9.body.message).toEqual('Project edited successfully');
  });

  test('organizer can [GET] project requirements, participants can [GET] projects', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockCategory.cat1);
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        ...mockEvents.event1,
        category_id: categoryId
      });
    expect(response3.status).toBe(201); 
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    expect(response7.body.message).toEqual('Project submitted successfully');
    let projectId2;
    const projectArray2 = response7.body.body;
    projectArray2.map(project => {
      projectId2 = project.id;
      return projectId2;
    });
    const response10 = await request(server)
      .get(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response10.status).toBe(200);
    expect(response10.body.message).toEqual(
      'All Project submissions retrieved successfully'
    );
    const response9 = await request(server)
      .get(`/api/events/projects/submissions/${projectId2}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response9.status).toBe(200);
    expect(response9.body.message).toEqual(
      'Project submission retrieved successfully'
    );
  });

  test('participants can [DELETE] project submission', async () => {
    const response5 = await request(server)
      .post('/api/event-category')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockCategory.cat1);
    expect(response5.status).toBe(201);
    const categoryId = response5.body.body.category_id;
    const response3 = await request(server)
      .post('/api/events')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        ...mockEvents.event1,
        category_id: categoryId
      });
    expect(response3.status).toBe(201);

    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response6.status).toBe(201);
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects/submissions`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response9 = await request(server)
      .delete(`/api/events/projects/submissions/${projectId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(response9.status).toBe(200);
    expect(response9.body.message).toEqual(
      'Project submission deleted successfully'
    );
  });
});
