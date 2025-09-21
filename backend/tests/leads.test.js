const request = require('supertest');
const app = require('../app');
require('./setup');

describe('Lead Management API', () => {
  let userToken;
  let leadId;

  beforeAll(async () => {
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Lead Manager',
        email: 'leadmgr@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;
  });

  describe('POST /api/leads', () => {
    test('should create a new lead', async () => {
      const leadData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send(leadData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe(leadData.fullName);
      expect(response.body.data.status).toBe('NEW');
      leadId = response.body.data.id;
    });

    test('should not create lead without fullName', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should not create lead with invalid email', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ fullName: 'Test User', email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/leads', () => {
    test('should get all leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter leads by status', async () => {
      const response = await request(app)
        .get('/api/leads?status=NEW')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(lead => lead.status === 'NEW')).toBe(true);
    });
  });

  describe('GET /api/leads/:id', () => {
    test('should get lead by id', async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(leadId);
    });

    test('should return 404 for non-existent lead', async () => {
      const response = await request(app)
        .get('/api/leads/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/leads/:id', () => {
    test('should update lead', async () => {
      // Create a fresh lead for this test
      const createResponse = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fullName: 'Update Test Lead',
          email: 'update@example.com'
        });
      
      const testLeadId = createResponse.body.data.id;
      
      const response = await request(app)
        .put(`/api/leads/${testLeadId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ fullName: 'Updated Lead Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Lead Name');
    });
  });

  describe('DELETE /api/leads/:id', () => {
    test('should delete lead', async () => {
      // Create a fresh lead for this test
      const createResponse = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fullName: 'Delete Test Lead',
          email: 'delete@example.com'
        });
      
      const testLeadId = createResponse.body.data.id;
      
      const response = await request(app)
        .delete(`/api/leads/${testLeadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});