const { PrismaClient } = require('../../generated/prisma');
const { hashPassword } = require('../utils/authentication');

const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const updateUser = async (userId, userData) => {
  const updateData = { ...userData };
  
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  
  return await prisma.user.update({
    where: { id: parseInt(userId) },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true
    }
  });
};

const deleteUser = async (userId) => {
  return await prisma.user.delete({
    where: { id: parseInt(userId) }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};