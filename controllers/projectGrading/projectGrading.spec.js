const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');
const mockEvents = require('../../data/mock/event.mock');
const mockCategory = require('../../data/mock/categories.mock');
const mockProjects = require('../../data/mock/projects.mock');
const mockGrading = require('../../data/mock/projectGrading.mock');
const mockUser = require('../../data/mock/auth.mock');

let token;

beforeEach(async () => {
  await db.raw(
    'TRUNCATE TABLE event_categories,users,events,project_entries,project_grading CASCADE'
  );
  // eslint-disable-next-line no-unused-vars
  const response = await request(server)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(mockUser.validInput1);
  token = response.body.body.token;
});

describe('organizer can add a judge to his/her team,judge can grade a submitted project', () => {
  test('organizer can [POST] team members,judges can [POST] grades', async () => {
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
    const response11 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.judge1);
    expect(response11.status).toBe(201);
    const judgeToken = response11.body.body.token;
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockGrading.teammate1);
    expect(response6.status).toBe(200);
    const response12 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.participant1);
    const particpanToken = response12.body.body.token;
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects`)
      .set('Authorization', particpanToken)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response13 = await request(server)
      .post(`/api/events/projects/${projectId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json')
      .send({
        ...mockGrading.projectGrade1,
        project_event_id: response3.body.body.event_id
      });
    expect(response13.status).toBe(201);
  });
  test('organizer can [POST] team members,judges can [PUT] grades', async () => {
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
    const response11 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.judge1);
    expect(response11.status).toBe(201);
    const judgeToken = response11.body.body.token;
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockGrading.teammate1);
    expect(response6.status).toBe(200);
    const response12 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.participant1);
    const particpanToken = response12.body.body.token;
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects`)
      .set('Authorization', particpanToken)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response13 = await request(server)
      .post(`/api/events/projects/${projectId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json')
      .send({
        ...mockGrading.projectGrade1,
        project_event_id: response3.body.body.event_id
      });
    expect(response13.status).toBe(201);
    let projectGradeId;
    const projectGradeArray = response13.body.body;
    projectGradeArray.map(project => {
      projectGradeId = project.project_id;

      return projectGradeId;
    });
    const response14 = await request(server)
      .put(`/api/events/projects/${projectGradeId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json')
      .send({
        ...mockGrading.projectGrade2,
        project_event_id: response3.body.body.event_id
      });
    expect(response14.status).toBe(201);
  });
  test('organizer can [POST] team members,judges can [DELETE] grades', async () => {
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
    const response11 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.judge1);
    expect(response11.status).toBe(201);
    const judgeToken = response11.body.body.token;
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockGrading.teammate1);
    expect(response6.status).toBe(200);
    const response12 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.participant1);
    const particpanToken = response12.body.body.token;
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects`)
      .set('Authorization', particpanToken)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response13 = await request(server)
      .post(`/api/events/projects/${projectId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json')
      .send({
        ...mockGrading.projectGrade1,
        project_event_id: response3.body.body.event_id
      });
    expect(response13.status).toBe(201);
    let projectGradeId;
    const projectGradeArray = response13.body.body;
    projectGradeArray.map(project => {
      projectGradeId = project.project_id;

      return projectGradeId;
    });
    const response14 = await request(server)
      .delete(`/api/events/projects/${projectGradeId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json');
    expect(response14.status).toBe(200);
  });
  test('organizer can [POST] team members,judges can [GET] grades', async () => {
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
    const response11 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.judge1);
    expect(response11.status).toBe(201);
    const judgeToken = response11.body.body.token;
    const response6 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send(mockGrading.teammate1);
    expect(response6.status).toBe(200);
    const response12 = await request(server)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockGrading.participant1);
    const particpanToken = response12.body.body.token;
    const response7 = await request(server)
      .post(`/api/events/${response3.body.body.event_id}/projects`)
      .set('Authorization', particpanToken)
      .set('Content-Type', 'application/json')
      .send(mockProjects.submission2);
    expect(response7.status).toBe(201);
    let projectId;
    const projectArray = response7.body.body;
    projectArray.map(project => {
      projectId = project.id;

      return projectId;
    });
    const response13 = await request(server)
      .post(`/api/events/projects/${projectId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json')
      .send({
        ...mockGrading.projectGrade1,
        project_event_id: response3.body.body.event_id
      });
    expect(response13.status).toBe(201);
    let projectGradeId;
    const projectGradeArray = response13.body.body;
    projectGradeArray.map(project => {
      projectGradeId = project.project_id;

      return projectGradeId;
    });
    const response14 = await request(server)
      .get(`/api/events/projects/${projectGradeId}/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json');
    expect(response14.status).toBe(200);
    const response15 = await request(server)
      .get(`/api/events/${response3.body.body.event_id}/projects/grading`)
      .set('Authorization', judgeToken)
      .set('Content-Type', 'application/json');
    expect(response15.status).toBe(200);
  });
});
