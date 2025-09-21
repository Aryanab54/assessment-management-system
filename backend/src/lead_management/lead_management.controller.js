const { createLead, getAllLeads, getLeadById, updateLead, deleteLead, getLeadsByStatus } = require('./lead_management.service');
const { validateLead } = require('../utils/validation');

const createLeadController = async (req, res) => {
  try {
    const validation = validateLead(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.errors.join(', ') });
    }
    
    const userId = req.user.userId;
    const result = await createLead(req.body, userId);
    res.status(201).json({ success: true, message: 'Lead created successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status } = req.query;
    const result = status ? await getLeadsByStatus(status) : await getAllLeads();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getLeadById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLeadController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateLead(id, req.body);
    res.status(200).json({ success: true, message: 'Lead updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeadController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteLead(id);
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLeadController,
  getLeads,
  getLead,
  updateLeadController,
  deleteLeadController
};