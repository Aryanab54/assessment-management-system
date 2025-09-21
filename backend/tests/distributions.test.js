const request = require('supertest');
const app = require('../app');
require('./setup');

describe('Lead Distribution API', () => {
  let userToken;
  let agentToken;
  let leadId;
  let agentId;

  beforeEach(async () => {
    // Create manager user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Distribution Manager',
        email: `distmgr${Date.now()}@example.com`,
        password: 'password123'
      });
    userToken = userResponse.body.data.token;

    // Create agent user
    const agentResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Agent User',
        email: `agent${Date.now()}@example.com`,
        password: 'password123'
      });
    agentToken = agentResponse.body.data.token;
    agentId = agentResponse.body.data.user.id;

    // Create a lead
    const leadResponse = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        fullName: 'Distribution Lead',
        email: `distlead${Date.now()}@example.com`,
        phone: '+1234567890'
      });
    leadId = leadResponse.body.data.id;
  });

  describe('POST /api/distributions/distribute', () => {
    test('should distribute lead to agent', async () => {
      const response = await request(app)
        .post('/api/distributions/distribute')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          leadId: leadId,
          agentId: agentId
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.leadId).toBe(leadId);
      expect(response.body.data.agentId).toBe(agentId);
    });

    test('should not distribute without leadId', async () => {
      const response = await request(app)
        .post('/api/distributions/distribute')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ agentId: agentId });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should not distribute without agentId', async () => {
      const response = await request(app)
        .post('/api/distributions/distribute')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ leadId: leadId });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/distributions/bulk-distribute', () => {
    test('should bulk distribute leads', async () => {
      // Create another lead
      const lead2Response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fullName: 'Bulk Lead',
          email: `bulk${Date.now()}@example.com`
        });

      const response = await request(app)
        .post('/api/distributions/bulk-distribute')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          leadIds: [lead2Response.body.data.id],
          agentId: agentId
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should not bulk distribute without leadIds array', async () => {
      const response = await request(app)
        .post('/api/distributions/bulk-distribute')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          leadIds: 'not-an-array',
          agentId: agentId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/distributions', () => {
    test('should get all distributions', async () => {
      const response = await request(app)
        .get('/api/distributions')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter distributions by agentId', async () => {
      const response = await request(app)
        .get(`/api/distributions?agentId=${agentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(dist => dist.agentId === agentId)).toBe(true);
    });
  });
});