const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/sectors
router.get('/', authMiddleware, sectorController.getAllSectors);

// POST /api/sectors
router.post('/', authMiddleware, sectorController.createSector);

module.exports = router;
