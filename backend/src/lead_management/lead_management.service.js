const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

const createLead = async (leadData, uploadedById) => {
  return await prisma.lead.create({
    data: {
      ...leadData,
      uploadedById
    }
  });
};

const getAllLeads = async () => {
  return await prisma.lead.findMany({
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      },
      uploadedBy: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getLeadById = async (leadId) => {
  return await prisma.lead.findUnique({
    where: { id: parseInt(leadId) },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      },
      uploadedBy: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

const updateLead = async (leadId, leadData) => {
  return await prisma.lead.update({
    where: { id: parseInt(leadId) },
    data: leadData
  });
};

const deleteLead = async (leadId) => {
  return await prisma.lead.delete({
    where: { id: parseInt(leadId) }
  });
};

const getLeadsByStatus = async (status) => {
  return await prisma.lead.findMany({
    where: { status },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsByStatus
};