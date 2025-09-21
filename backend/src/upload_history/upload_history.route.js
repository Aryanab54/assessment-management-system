const express = require('express');
const { uploadFile, getUserUploadHistory, getUploadHistoryAll } = require('./upload_history.controller');
const { authenticateToken } = require('../utils/authentication');

const router = express.Router();

router.post('/upload', authenticateToken, uploadFile);
router.get('/user', authenticateToken, getUserUploadHistory);
router.get('/all', authenticateToken, getUploadHistoryAll);

module.exports = router;