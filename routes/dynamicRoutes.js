const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamicController');

router.get('/:table', dynamicController.getTableData);

module.exports = router;
