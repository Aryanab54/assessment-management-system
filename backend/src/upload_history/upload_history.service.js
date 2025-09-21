const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

const createUploadHistory = async (fileName, filePath, uploadedById) => {
  return await prisma.uploadHistory.create({
    data: {
      fileName,
      filePath,
      uploadedById
    }
  });
};

const getUploadHistory = async (userId) => {
  return await prisma.uploadHistory.findMany({
    where: { uploadedById: userId },
    orderBy: { uploadedAt: 'desc' },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

const getAllUploadHistory = async () => {
  return await prisma.uploadHistory.findMany({
    orderBy: { uploadedAt: 'desc' },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

module.exports = {
  createUploadHistory,
  getUploadHistory,
  getAllUploadHistory
};