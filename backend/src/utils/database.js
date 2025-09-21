const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

const closeDatabaseConnection = async () => {
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  checkDatabaseConnection,
  closeDatabaseConnection
};