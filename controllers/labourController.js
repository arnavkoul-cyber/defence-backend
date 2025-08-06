const db = require('../config/db');

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


// // Get labourers assigned to army unit using army unit mobile_number number
// exports.getLabourersByArmyUnitPhone = async (req, res) => {
//   const mobile_number = req.params.mobile_number;

//   try {
//     // First find army_unit by mobile_number
//     const result = await db.query('SELECT id FROM army_units WHERE mobile_number = $1', [mobile_number]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Army unit not found with this mobile_number number' });
//     }

//     const army_unit_id = result.rows[0].id;

//     // Fetch all labourers assigned to this army_unit
//     const labourers = await db.query('SELECT * FROM labourers WHERE army_unit_id = $1', [
//       army_unit_id,
//     ]);

//     return res.status(200).json({ labourers: labourers.rows });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// exports.getAssignedLaboursForArmyUnit = async (req, res) => {
//   const mobile = req.params.mobile_number;

//   try {
//     // Get army_unit_id from user (army user)
//     const [user] = await db.query('SELECT army_unit_id FROM users WHERE mobile_number = ?', [mobile]);

//     if (!user.length || !user[0].army_unit_id) {
//       return res.status(404).json({ error: 'Army unit not found for this number' });
//     }

//     const armyUnitId = user[0].army_unit_id;

//     // Get labours assigned to this army unit
//     const [labours] = await db.query(`
//       SELECT id, name, father_name, contact_number, aadhaar_number, created_at 
//       FROM labourers 
//       WHERE army_unit_id = ?
//     `, [armyUnitId]);

//     res.status(200).json({
//       army_unit_id: armyUnitId,
//       total_labours: labours.length,
//       labours
//     });

//   } catch (err) {
//     console.error('Error fetching assigned labours:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getAssignedLaboursByMobile = async (req, res) => {
  const mobileNumber = req.params.mobile_number;

  try {
    const labourers = await labourModel.getAssignedLaboursByMobile(mobileNumber);

    if (!labourers) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ labours: labourers });
  } catch (error) {
    console.error('Error fetching assigned labours:', error);
    res.status(500).json({ message: 'Server error' });
  }
};