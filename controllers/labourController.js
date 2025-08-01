const labourModel = require('../models/labourModel');
const userModel = require('../models/userModel')
const path = require('path');

exports.registerLabour = async (req, res) => {
  try {
    const { name, father_name, sector_id, contact_number, aadhaar_number } = req.body;
    const photo_path = req.file ? req.file.path : null;

    // Check for duplicate Aadhaar or contact number
    const isDuplicate = await labourModel.checkDuplicate(aadhaar_number, contact_number);
    if (isDuplicate) {
      return res.status(400).json({ error: 'Aadhaar or contact number already exists' });
    }

    const labourId = await labourModel.registerLabour({
      name, father_name, sector_id,
      contact_number, aadhaar_number, photo_path
    });

    res.status(201).json({
      message: 'Labour registered successfully',
      labour_id: labourId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register labour' });
  }
};

exports.laboursList = async (req, res) => {
  try {
    const officer_id = req.params.officer_id;

    // Check for duplicate Aadhaar or contact number
    const isDuplicate = await userModel.findUserById(officer_id);
    if (!isDuplicate) {
      return res.status(404).json({ error: 'Officer not registered' });
    }

    const labours = await labourModel.laboursByOfficer(
      officer_id
    );

    res.status(200).json({
      labours
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch labours list' });
  }
};


exports.assignArmyUnit = async (req, res) => {
  try {
    const { army_unit_id, labour_ids } = req.body;

    if (!army_unit_id || !Array.isArray(labour_ids) || labour_ids.length === 0) {
      return res.status(400).json({ error: 'army_unit_id and labour_ids are required' });
    }

    const result = await labourModel.assignArmyUnits(army_unit_id,labour_ids)
    res.status(200).json({
      message: 'Labours assigned successfully',
      updated_count: result.affectedRows
    });
  } catch (err) {
    console.error('Error assigning army unit:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

