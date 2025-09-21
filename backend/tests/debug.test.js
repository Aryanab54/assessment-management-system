const request = require('supertest');
const app = require('../app');
require('./setup');

describe('Debug API Issues', () => {
  let userToken;

  beforeAll(async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Debug User',
        email: 'debug@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;
  });

  test('debug lead creation', async () => {
    const leadData = {
      fullName: 'Debug Lead',
      email: 'debug@example.com',
      phone: '+1234567890'
    };

    const response = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${userToken}`)
      .send(leadData);

    console.log('Lead creation response:', JSON.stringify(response.body, null, 2));
    console.log('Status:', response.status);
  });

  test('debug report generation', async () => {
    const response = await request(app)
      .post('/api/reports/generate-report')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ session_id: 'session_001' });

    console.log('Report generation response:', JSON.stringify(response.body, null, 2));
    console.log('Status:', response.status);
  });
});