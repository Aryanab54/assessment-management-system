const { PrismaClient } = require('../../generated/prisma');
const { hashPassword, comparePassword, generateToken } = require('../utils/authentication');

const prisma = new PrismaClient();

const registerUser = async (userData) => {
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Name, email and password are required');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'AGENT'
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  const token = generateToken(user.id, user.email);
  return { user, token };
};

const loginUser = async (loginData) => {
  if (!loginData.email || !loginData.password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email: loginData.email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.email);
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    token
  };
};

module.exports = { registerUser, loginUser };