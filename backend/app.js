const express = require('express');
const cors = require('cors');
const { checkDatabaseConnection } = require('./src/utils/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', require('./api.route'));

const startServer = async () => {
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }
  
  app.listen(9000, () => {
    console.log('Assessment Management System server running on port 9000');
    console.log('Health check: http://localhost:9000/api/health');
  });
};

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  startServer();
}

module.exports = app;
