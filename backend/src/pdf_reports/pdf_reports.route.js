const express = require('express');
const { generateReportController } = require('./pdf_reports.controller');
const { authenticateToken } = require('../utils/authentication');

const router = express.Router();

router.post('/generate-report', authenticateToken, generateReportController);

module.exports = router;