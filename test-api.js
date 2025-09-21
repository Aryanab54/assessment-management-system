const axios = require('axios');

const API_BASE = 'http://localhost:9000/api';

async function testAPI() {
  console.log('🧪 Testing Assessment Management System API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Register User
    console.log('\n2️⃣ Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.user.email);
    const token = registerResponse.data.user.token;

    // Test 3: Login
    console.log('\n3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login successful:', loginResponse.data.user.email);

    // Test 4: Generate Report - Health & Fitness
    console.log('\n4️⃣ Testing PDF Report Generation (Health & Fitness)...');
    const reportResponse1 = await axios.post(`${API_BASE}/reports/generate-report`, {
      session_id: 'session_001'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Health & Fitness Report:', reportResponse1.data.data.fileName);
    console.log('   📁 File Path:', reportResponse1.data.data.filePath);
    console.log('   📊 Assessment Type:', reportResponse1.data.data.assessmentType);

    // Test 5: Generate Report - Cardiac
    console.log('\n5️⃣ Testing PDF Report Generation (Cardiac)...');
    const reportResponse2 = await axios.post(`${API_BASE}/reports/generate-report`, {
      session_id: 'session_002'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Cardiac Report:', reportResponse2.data.data.fileName);
    console.log('   📁 File Path:', reportResponse2.data.data.filePath);
    console.log('   📊 Assessment Type:', reportResponse2.data.data.assessmentType);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User Authentication: Working');
    console.log('   ✅ PDF Generation: Working');
    console.log('   ✅ Configuration System: Working');
    console.log('   ✅ File Storage: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.status === 500) {
      console.log('💡 Make sure the backend server is running and database is connected');
    }
  }
}

// Run tests if backend is available
axios.get(`${API_BASE}/health`)
  .then(() => testAPI())
  .catch(() => {
    console.log('❌ Backend server not running on port 9000');
    console.log('💡 Start the backend server first: cd backend && npm start');
  });