const express = require('express');
const authRoutes = require('./src/login/login.route');
const reportRoutes = require('./src/pdf_reports/pdf_reports.route');
const userRoutes = require('./src/user_management/user_management.route');
const leadRoutes = require('./src/lead_management/lead_management.route');
const distributionRoutes = require('./src/lead_distribution/lead_distribution.route');
const uploadRoutes = require('./src/upload_history/upload_history.route');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Assessment Management System API is running' });
});

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);
router.use('/distributions', distributionRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;