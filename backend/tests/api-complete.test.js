const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

describe('Complete API Test Suite', () => {
  let userToken;
  let userId;
  let agentToken;
  let agentId;
  let leadId;

  beforeAll(async () => {
    // Clean database
    await prisma.distribution.deleteMany();
    await prisma.uploadHistory.deleteMany();
    await prisma.pdfReport.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.distribution.deleteMany();
    await prisma.uploadHistory.deleteMany();
    await prisma.pdfReport.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('1. Health Check', () => {
    test('GET /api/health should return success', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('2. Authentication', () => {
    test('POST /api/auth/register should register user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      userToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    test('POST /api/auth/register should register agent', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Agent User',
          email: 'agent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      agentToken = response.body.data.token;
      agentId = response.body.data.user.id;
    });

    test('POST /api/auth/login should login user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('3. User Management', () => {
    test('GET /api/users should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/users/:id should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
    });

    test('PUT /api/users/:id should update user', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated User' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated User');
    });
  });

  describe('4. Lead Management', () => {
    test('POST /api/leads should create lead', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('John Doe');
      leadId = response.body.data.id;
    });

    test('GET /api/leads should get all leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/leads/:id should get lead by id', async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(leadId);
    });

    test('PUT /api/leads/:id should update lead', async () => {
      const response = await request(app)
        .put(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ fullName: 'Updated Lead' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Lead');
    });
  });

  describe('5. Lead Distribution', () => {
    test('POST /api/distributions/distribute should distribute lead', async () => {
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

    test('GET /api/distributions should get distributions', async () => {
      const response = await request(app)
        .get('/api/distributions')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/distributions?agentId should filter by agent', async () => {
      const response = await request(app)
        .get(`/api/distributions?agentId=${agentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(dist => dist.agentId === agentId)).toBe(true);
    });
  });

  describe('6. Upload History', () => {
    test('POST /api/uploads/upload should record upload', async () => {
      const response = await request(app)
        .post('/api/uploads/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fileName: 'test.csv',
          filePath: '/uploads/test.csv'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fileName).toBe('test.csv');
    });

    test('GET /api/uploads/user should get user uploads', async () => {
      const response = await request(app)
        .get('/api/uploads/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/uploads/all should get all uploads', async () => {
      const response = await request(app)
        .get('/api/uploads/all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('7. Report Generation', () => {
    test('POST /api/reports/generate-report should generate health report', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'session_001' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.assessmentType).toBe('Health & Fitness Assessment');
      expect(response.body.data.fileName).toBeDefined();
    });

    test('POST /api/reports/generate-report should generate cardiac report', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'session_002' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.assessmentType).toBe('Cardiac Assessment');
    });

    test('POST /api/reports/generate-report should reject invalid session', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ session_id: 'invalid_session' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('8. Authentication Required Tests', () => {
    test('should reject requests without token', async () => {
      const endpoints = [
        { method: 'get', path: '/api/users' },
        { method: 'post', path: '/api/leads' },
        { method: 'get', path: '/api/distributions' },
        { method: 'post', path: '/api/uploads/upload' },
        { method: 'post', path: '/api/reports/generate-report' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('9. Cleanup Tests', () => {
    test('DELETE /api/leads/:id should delete lead', async () => {
      const response = await request(app)
        .delete(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('DELETE /api/users/:id should delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${agentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});