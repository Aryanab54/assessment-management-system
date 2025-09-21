const express = require('express');
const { getUsers, getUser, updateUserController, deleteUserController } = require('./user_management.controller');
const { authenticateToken } = require('../utils/authentication');

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateUserController);
router.delete('/:id', authenticateToken, deleteUserController);

module.exports = router;