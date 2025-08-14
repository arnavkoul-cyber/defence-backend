// const attendanceModel = require('./models/attendanceModel');
const attendanceModel = require('../models/AttendanceModel')
const path = require('path');


exports.markAttendance = async (req, res) => {
  try {
    const { labour_id, army_unit_id, attendance_date,status } = req.body;
    const photo_path = req.file ? req.file.path.replace(/\\\\/g, '/').replace(/\\/g, '/') : null;
    console.log("photo path",photo_path)

    if (!labour_id || !army_unit_id || !attendance_date || !photo_path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const attendanceId = await attendanceModel.markAttendance({
      labour_id,
      army_unit_id,
      photo_path,
      attendance_date,
      status
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance_id: attendanceId,
    });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getByArmyUnit = async (req, res) => {
  try {
    const { army_unit_id } = req.params;
    const data = await attendanceModel.getByArmyUnit(army_unit_id);
    res.status(200).json({ attendances: data });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getByLabour = async (req, res) => {
  try {
    const { labour_id } = req.params;
    const data = await attendanceModel.getByLabour(labour_id);
    res.status(200).json({ attendances: data });
  } catch (err) {
    console.error('Error fetching labour attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getByDate = async (req, res) => {
  try {
    const { army_unit_id, date } = req.query;

    if (!army_unit_id || !date) {
      return res.status(400).json({ error: 'army_unit_id and date are required' });
    }

    const data = await attendanceModel.getByDate(army_unit_id, date);
    res.status(200).json({ attendances: data });
  } catch (err) {
    console.error('Error fetching attendance by date:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
