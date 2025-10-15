exports.deleteArmyUnitByName = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ success: false, error: 'name is required' });
    }
    const result = await armyUnitModel.deleteArmyUnitByName(name);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Army unit not found' });
    }
    res.json({ success: true, message: 'Army unit deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};
const armyUnitModel = require('../models/armyUnitModel');


exports.getAllArmyUnits = async (req, res) => {
  try {
    const units = await armyUnitModel.getAllArmyUnits();
    res.json({ success: true, army_units: units });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};

exports.createArmyUnit = async (req, res) => {
  try {
    const { name, sector_id } = req.body;
    if (!name || !sector_id) {
      return res.status(400).json({ success: false, error: 'name and sector_id are required' });
    }
    const newUnit = await armyUnitModel.createArmyUnit(name, sector_id);
    res.status(201).json({ success: true, army_unit: newUnit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};
