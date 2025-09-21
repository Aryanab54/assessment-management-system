const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  let token;
  let userId;
  let leadId;

  test('Health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  test('Login user', async () => {
    const email = `login${Date.now()}@example.com`;
    
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email,
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'password123' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Get users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Create lead', async () => {
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

  test('Get leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Upload file', async () => {
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

  test('Generate report', async () => {
    const res = await request(app)
      .post('/api/reports/generate-report')
      .set('Authorization', `Bearer ${token}`)
      .send({ session_id: 'session_001' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Unauthorized access', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});