const { distributeLead, getDistributions, getAgentDistributions, bulkDistributeLeads } = require('./lead_distribution.service');

const distributeLeadController = async (req, res) => {
  try {
    const { leadId, agentId } = req.body;
    
    if (!leadId || !agentId) {
      return res.status(400).json({ success: false, message: 'leadId and agentId are required' });
    }
    
    const result = await distributeLead(leadId, agentId);
    res.status(201).json({ success: true, message: 'Lead distributed successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDistributionsController = async (req, res) => {
  try {
    const { agentId } = req.query;
    const result = agentId ? await getAgentDistributions(agentId) : await getDistributions();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkDistributeController = async (req, res) => {
  try {
    const { leadIds, agentId } = req.body;
    
    if (!leadIds || !Array.isArray(leadIds) || !agentId) {
      return res.status(400).json({ success: false, message: 'leadIds (array) and agentId are required' });
    }
    
    const result = await bulkDistributeLeads(leadIds, agentId);
    res.status(201).json({ success: true, message: 'Leads distributed successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  distributeLeadController,
  getDistributionsController,
  bulkDistributeController
};