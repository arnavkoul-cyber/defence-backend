const sectorModel = require('../models/sectorModel');

// GET /api/sectors
exports.getAllSectors = async (req, res) => {
  try {
    const sectors = await sectorModel.getAllSectors();
    res.json({ success: true, sectors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};

// POST /api/sectors
exports.createSector = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Sector name is required' });
    const newSector = await sectorModel.createSector(name);
    res.status(201).json({ success: true, sector: newSector });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};
