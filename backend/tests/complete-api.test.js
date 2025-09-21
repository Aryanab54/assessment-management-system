const request = require('supertest');
const app = require('../app');

describe('Complete API Coverage', () => {
  let token, userId, agentId, leadId;

  beforeAll(async () => {
    // Setup test user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    token = userRes.body.data.token;
    userId = userRes.body.data.user.id;

    // Setup agent
    const agentRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Agent User',
        email: `agent${Date.now()}@example.com`,
        password: 'password123'
      });
    agentId = agentRes.body.data.user.id;

    // Setup lead
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Test Lead',
        email: `lead${Date.now()}@example.com`
      });
    leadId = leadRes.body.data.id;
  });

  // Health Check
  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  // Authentication
  test('POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: `new${Date.now()}@example.com`,
        password: 'password123'
      });
    expect(res.status).toBe(201);
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
  });

  // User Management
  test('GET /api/users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/users/:id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('PUT /api/users/:id', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
  });

  // Lead Management
  test('POST /api/leads', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'New Lead',
        email: `newlead${Date.now()}@example.com`
      });
    expect(res.status).toBe(201);
  });

  test('GET /api/leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/leads?status=NEW', async () => {
    const res = await request(app)
      .get('/api/leads?status=NEW')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/leads/:id', async () => {
    const res = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('PUT /api/leads/:id', async () => {
    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'Updated Lead' });
    expect(res.status).toBe(200);
  });

  // Lead Distribution
  test('POST /api/distributions/distribute', async () => {
    const res = await request(app)
      .post('/api/distributions/distribute')
      .set('Authorization', `Bearer ${token}`)
      .send({ leadId, agentId });
    expect(res.status).toBe(201);
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
  });

  test('GET /api/distributions', async () => {
    const res = await request(app)
      .get('/api/distributions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/distributions?agentId=1', async () => {
    const res = await request(app)
      .get(`/api/distributions?agentId=${agentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // Upload History
  test('POST /api/uploads/upload', async () => {
    const res = await request(app)
      .post('/api/uploads/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'test.csv',
        filePath: '/uploads/test.csv'
      });
    expect(res.status).toBe(201);
  });

  test('GET /api/uploads/user', async () => {
    const res = await request(app)
      .get('/api/uploads/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/uploads/all', async () => {
    const res = await request(app)
      .get('/api/uploads/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // Report Generation
  test('POST /api/reports/generate-report (Health)', async () => {
    const res = await request(app)
      .post('/api/reports/generate-report')
      .set('Authorization', `Bearer ${token}`)
      .send({ session_id: 'session_001' });
    expect(res.status).toBe(200);
  });

  test('POST /api/reports/generate-report (Cardiac)', async () => {
    const res = await request(app)
      .post('/api/reports/generate-report')
      .set('Authorization', `Bearer ${token}`)
      .send({ session_id: 'session_002' });
    expect(res.status).toBe(200);
  });

  // Cleanup
  test('DELETE /api/leads/:id', async () => {
    const res = await request(app)
      .delete(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('DELETE /api/users/:id', async () => {
    const res = await request(app)
      .delete(`/api/users/${agentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});