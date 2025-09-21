// Demo script showing API usage
const axios = require('axios');

const BASE_URL = 'http://localhost:9000/api';

async function demo() {
  try {
    console.log('=== Assessment Management System Demo ===\n');
    
    // 1. Health Check
    console.log('1. Checking server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Server is running:', healthResponse.data.message);
    
    // 2. User Registration
    console.log('\n2. Registering a new user...');
    const registerData = {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    };
    
    let token;
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      token = registerResponse.data.data.token;
      console.log('✓ User registered successfully');
      console.log('User ID:', registerResponse.data.data.user.id);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('User already exists, trying to login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: registerData.email,
          password: registerData.password
        });
        token = loginResponse.data.data.token;
        console.log('✓ User logged in successfully');
      } else {
        throw error;
      }
    }
    
    // 3. Generate Report for Health & Fitness Assessment
    console.log('\\n3. Generating Health & Fitness Assessment report...');
    const healthReportResponse = await axios.post(
      `${BASE_URL}/reports/generate-report`,
      { session_id: 'session_001' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✓ Health report generated successfully');
    console.log('Report ID:', healthReportResponse.data.data.reportId);
    console.log('File Path:', healthReportResponse.data.data.filePath);
    console.log('Assessment Type:', healthReportResponse.data.data.assessmentType);
    
    // 4. Generate Report for Cardiac Assessment
    console.log('\\n4. Generating Cardiac Assessment report...');
    const cardiacReportResponse = await axios.post(
      `${BASE_URL}/reports/generate-report`,
      { session_id: 'session_002' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✓ Cardiac report generated successfully');
    console.log('Report ID:', cardiacReportResponse.data.data.reportId);
    console.log('File Path:', cardiacReportResponse.data.data.filePath);
    console.log('Assessment Type:', cardiacReportResponse.data.data.assessmentType);
    
    console.log('\\n=== Demo Complete ===');
    console.log('Check the reports/ directory for generated PDF files');
    
  } catch (error) {
    console.error('Demo failed:', error.response?.data || error.message);
  }
}

// Run demo if server is not running
if (require.main === module) {
  console.log('Please make sure the server is running (npm start) before running this demo');
  console.log('Then run: node demo.js');
}

module.exports = demo;