const request = require('supertest');
const server = require('./server');

describe('server', () => {
    it('[GET] / WORKS!', () => {
        return request(server)
          .get('/')
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).toEqual({ status: 200, message: 'Hello from Hackton backend!' });
          });
      });
      it('[GET] / Fails!', () => {
        return request(server)
          .get('/wrong')
          .expect(404);
      });
})