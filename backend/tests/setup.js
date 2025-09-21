const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

beforeEach(async () => {
  // Clean up before each test to avoid conflicts
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

module.exports = { prisma };