const express = require('express');
const { distributeLeadController, getDistributionsController, bulkDistributeController } = require('./lead_distribution.controller');
const { authenticateToken } = require('../utils/authentication');

const router = express.Router();

router.post('/distribute', authenticateToken, distributeLeadController);
router.post('/bulk-distribute', authenticateToken, bulkDistributeController);
router.get('/', authenticateToken, getDistributionsController);

module.exports = router;