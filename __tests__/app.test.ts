// __tests__/app.test.ts

const request = require('supertest');
const app = require('../app'); // Update the path based on your directory structure


describe('GET /awesome/application', () => {
  it('should respond with a list of users', async () => {
    const response = await request(app).get('/awesome/application');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /awesome/application/create', () => {
  it('should create a new user', async () => {
    const newUser = {
      username: 'testuser',
      birthdate: '2000-01-01',
      email: 'test@example.com',
    };

    const response = await request(app)
      .post('/awesome/application/create')
      .send(newUser);

    expect(response.statusCode).toBe(200);
  });
});

