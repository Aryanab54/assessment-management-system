// Simple API test script
const { checkDatabaseConnection } = require('./src/utils/database');
const { getAssessmentBySessionId } = require('./data');
const { reportConfigurations } = require('./config');

async function testBackend() {
  console.log('🧪 Testing Assessment Management System Backend\n');
  
  // Test 1: Database Connection
  console.log('1. Testing database connection...');
  const dbConnected = await checkDatabaseConnection();
  console.log(dbConnected ? '✅ Database connection: OK' : '❌ Database connection: FAILED');
  
  // Test 2: Sample Data
  console.log('\n2. Testing sample data...');
  const session1 = getAssessmentBySessionId('session_001');
  const session2 = getAssessmentBySessionId('session_002');
  console.log(session1 ? '✅ Session 001 data: OK' : '❌ Session 001 data: MISSING');
  console.log(session2 ? '✅ Session 002 data: OK' : '❌ Session 002 data: MISSING');
  
  // Test 3: Configuration
  console.log('\n3. Testing configuration system...');
  const config1 = reportConfigurations['as_hr_02'];
  const config2 = reportConfigurations['as_card_01'];
  console.log(config1 ? '✅ Health & Fitness config: OK' : '❌ Health & Fitness config: MISSING');
  console.log(config2 ? '✅ Cardiac config: OK' : '❌ Cardiac config: MISSING');
  
  // Test 4: API Modules
  console.log('\n4. Testing API modules...');
  const modules = [
    'src/login/login.route.js',
    'src/pdf_reports/pdf_reports.route.js',
    'src/user_management/user_management.route.js',
    'src/lead_management/lead_management.route.js',
    'src/lead_distribution/lead_distribution.route.js',
    'src/upload_history/upload_history.route.js'
  ];
  
  modules.forEach(module => {
    try {
      require(`./${module}`);
      console.log(`✅ ${module.split('/')[1]}: OK`);
    } catch (error) {
      console.log(`❌ ${module.split('/')[1]}: FAILED`);
    }
  });
  
  console.log('\n🎉 Backend test complete!');
  console.log('Start server with: npm start');
  process.exit(0);
}

testBackend().catch(console.error);