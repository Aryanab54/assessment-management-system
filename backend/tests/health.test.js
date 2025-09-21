const request = require('supertest');
const app = require('../app');

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Assessment Management System API is running');
    });
  });

  describe('404 Routes', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(404);
    });
  });
});