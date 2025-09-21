const request = require('supertest');
const app = require('../app');
require('./setup');

describe('Upload History API', () => {
  let userToken;

  beforeAll(async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Upload User',
        email: 'upload@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;
  });

  describe('POST /api/uploads/upload', () => {
    test('should record file upload', async () => {
      const uploadData = {
        fileName: 'test-file.csv',
        filePath: '/uploads/test-file.csv'
      };

      const response = await request(app)
        .post('/api/uploads/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .send(uploadData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fileName).toBe(uploadData.fileName);
      expect(response.body.data.filePath).toBe(uploadData.filePath);
    });

    test('should not record upload without fileName', async () => {
      const response = await request(app)
        .post('/api/uploads/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ filePath: '/uploads/test.csv' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should not record upload without filePath', async () => {
      const response = await request(app)
        .post('/api/uploads/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ fileName: 'test.csv' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should not record upload without authentication', async () => {
      const response = await request(app)
        .post('/api/uploads/upload')
        .send({
          fileName: 'test.csv',
          filePath: '/uploads/test.csv'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/uploads/user', () => {
    test('should get user upload history', async () => {
      const response = await request(app)
        .get('/api/uploads/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should not get upload history without authentication', async () => {
      const response = await request(app).get('/api/uploads/user');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/uploads/all', () => {
    test('should get all upload history', async () => {
      const response = await request(app)
        .get('/api/uploads/all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should not get all uploads without authentication', async () => {
      const response = await request(app).get('/api/uploads/all');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});