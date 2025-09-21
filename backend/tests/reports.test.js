const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');
require('./setup');

describe('Reports API', () => {
  let userToken;

  beforeAll(async () => {
    // Create test user and get token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Report User',
        email: 'report@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;
  });

  describe('POST /api/reports/generate-report', () => {
    test('should generate report for valid session_id', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'session_001' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fileName).toBeDefined();
      expect(response.body.data.filePath).toBeDefined();
      expect(response.body.data.assessmentType).toBe('Health & Fitness Assessment');

      // Check if PDF file was created
      const filePath = response.body.data.filePath;
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('should generate cardiac report', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'session_002' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.assessmentType).toBe('Cardiac Assessment');
    });

    test('should not generate report without authentication', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .send({ session_id: 'session_001' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should not generate report for invalid session_id', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'invalid_session' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    test('should not generate report without session_id', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});