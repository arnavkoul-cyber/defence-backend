const express = require('express');
const router = express.Router();
const armyUnitController = require('../controllers/armyUnitController');


// GET /api/army-units
router.get('/', armyUnitController.getAllArmyUnits);

// POST /api/army-units
router.post('/', armyUnitController.createArmyUnit);


// DELETE /api/army-units/name/:name
router.delete('/name/:name', armyUnitController.deleteArmyUnitByName);

module.exports = router;
