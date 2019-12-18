const request = require('supertest');
const server = require('../server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
  username: "test",
  password: "test",
  bio: "I am a robot",
  email: "test@email.com",
  fullname: "tests tests"
};

beforeEach(async () => {
    await db("event_categories").del();
    await db("events").del();
    await db("users").del();

//   const a = await request(server)
//     .post("/api/auth/register")
//     .send(addUser);

//   token = res.body.token;
  //   console.log(token);
});

describe("api/auth/* endpoints", () => {
  describe("[POST] /api/auth", () => {
    test("should return 201 Created", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send(addUser);
      expect(response.status).toBe(201);
    });

    // test('should return user credentials', () => {
    //     const response = await request(server)
    //         .post('/api/auth/register')
    //         .send(addUser);
    //         expect(response.body).not.toBe(undefined)
    // })

    test("should return a token", async () => {
        const response = await request(server)
          .post("/api/auth/register")
          .send(addUser);
        expect(response.body.token).not.toBe(undefined);
    });
  });
});
