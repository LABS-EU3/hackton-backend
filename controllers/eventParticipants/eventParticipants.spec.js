const request = require('supertest');
const server = require('../../api/server');
const db = require('../../data/dbConfig');

let token;

const addUser = {
    email: 'test@mail.com',
    password: 'test'
}