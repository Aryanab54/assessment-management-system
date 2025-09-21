const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

const distributeLead = async (leadId, agentId) => {
  // Create distribution record
  const distribution = await prisma.distribution.create({
    data: {
      leadId: parseInt(leadId),
      agentId: parseInt(agentId)
    }
  });

  // Update lead status and assignment
  await prisma.lead.update({
    where: { id: parseInt(leadId) },
    data: {
      status: 'ASSIGNED',
      assignedToId: parseInt(agentId)
    }
  });

  return distribution;
};

const getDistributions = async () => {
  return await prisma.distribution.findMany({
    include: {
      lead: {
        select: { id: true, fullName: true, email: true, phone: true, status: true }
      },
      agent: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { distributedAt: 'desc' }
  });
};

const getAgentDistributions = async (agentId) => {
  return await prisma.distribution.findMany({
    where: { agentId: parseInt(agentId) },
    include: {
      lead: {
        select: { id: true, fullName: true, email: true, phone: true, status: true }
      }
    },
    orderBy: { distributedAt: 'desc' }
  });
};

const bulkDistributeLeads = async (leadIds, agentId) => {
  const distributions = [];
  
  for (const leadId of leadIds) {
    const distribution = await distributeLead(leadId, agentId);
    distributions.push(distribution);
  }
  
  return distributions;
};

module.exports = {
  distributeLead,
  getDistributions,
  getAgentDistributions,
  bulkDistributeLeads
};