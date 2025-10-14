
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users (protected)
router.get('/', authMiddleware, userController.getAllUsers);

// POST /api/users (protected)
router.post('/', authMiddleware, userController.createUser);

// DELETE /api/users/:mobile_number (protected)
router.delete('/:mobile_number', authMiddleware, userController.deleteUserByMobile);

module.exports = router;
