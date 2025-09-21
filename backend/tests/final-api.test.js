const request = require('supertest');
const app = require('../app');

describe('Final API Test - All 19 Endpoints', () => {
  let token, userId, agentId, leadId;

  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    token = userRes.body.data.token;
    userId = userRes.body.data.user.id;

    const agentRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Agent User',
        email: `agent${Date.now()}@example.com`,
        password: 'password123'
      });
    agentId = agentRes.body.data.user.id;
  });

  // 1. Health Check
  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 2-3. Authentication
  test('POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: `new${Date.now()}@example.com`,
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/login', async () => {
    const email = `login${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Test', email, password: 'password123' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 4-7. User Management
  test('GET /api/users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/users/:id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('PUT /api/users/:id', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/users/:id', async () => {
    const newUserRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Delete User',
        email: `delete${Date.now()}@example.com`,
        password: 'password123'
      });
    
    const res = await request(app)
      .delete(`/api/users/${newUserRes.body.data.user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 8-12. Lead Management
  test('POST /api/leads', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Test Lead',
        email: `lead${Date.now()}@example.com`
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    leadId = res.body.data.id;
  });

  test('GET /api/leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/leads?status=NEW', async () => {
    const res = await request(app)
      .get('/api/leads?status=NEW')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/leads/:id', async () => {
    const res = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('PUT /api/leads/:id', async () => {
    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'Updated Lead' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/leads/:id', async () => {
    const newLeadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Delete Lead',
        email: `deletelead${Date.now()}@example.com`
      });
    
    const res = await request(app)
      .delete(`/api/leads/${newLeadRes.body.data.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 13-15. Lead Distribution
  test('POST /api/distributions/distribute', async () => {
    const res = await request(app)
      .post('/api/distributions/distribute')
      .set('Authorization', `Bearer ${token}`)
      .send({ leadId, agentId });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/distributions/bulk-distribute', async () => {
    const newLeadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Bulk Lead',
        email: `bulk${Date.now()}@example.com`
      });
    
    const res = await request(app)
      .post('/api/distributions/bulk-distribute')
      .set('Authorization', `Bearer ${token}`)
      .send({ leadIds: [newLeadRes.body.data.id], agentId });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/distributions', async () => {
    const res = await request(app)
      .get('/api/distributions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 16-18. Upload History
  test('POST /api/uploads/upload', async () => {
    const res = await request(app)
      .post('/api/uploads/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'test.csv',
        filePath: '/uploads/test.csv'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/uploads/user', async () => {
    const res = await request(app)
      .get('/api/uploads/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/uploads/all', async () => {
    const res = await request(app)
      .get('/api/uploads/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 19. Report Generation
  test('POST /api/reports/generate-report', async () => {
    const res = await request(app)
      .post('/api/reports/generate-report')
      .set('Authorization', `Bearer ${token}`)
      .send({ session_id: 'session_001' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assessmentType).toBe('Health & Fitness Assessment');
  });
});