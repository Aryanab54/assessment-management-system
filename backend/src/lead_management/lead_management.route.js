const express = require('express');
const { createLeadController, getLeads, getLead, updateLeadController, deleteLeadController } = require('./lead_management.controller');
const { authenticateToken } = require('../utils/authentication');

const router = express.Router();

router.post('/', authenticateToken, createLeadController);
router.get('/', authenticateToken, getLeads);
router.get('/:id', authenticateToken, getLead);
router.put('/:id', authenticateToken, updateLeadController);
router.delete('/:id', authenticateToken, deleteLeadController);

module.exports = router;