// GET /api/attendance/report/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&army_unit_id=1
exports.getRangeReport = async (req, res) => {
  try {
    const { start_date, end_date, army_unit_id } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required in YYYY-MM-DD format' });
    }
    const data = await attendanceModel.getRangeReport(start_date, end_date, army_unit_id);
    res.status(200).json({ report: data });
  } catch (err) {
    console.error('Error fetching range report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// const attendanceModel = require('./models/attendanceModel');
const attendanceModel = require('../models/attendanceModel')
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

// GET /api/attendance/report/monthly?month=YYYY-MM&army_unit_id=1
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, army_unit_id } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'month is required in YYYY-MM format' });
    }

    const data = await attendanceModel.getMonthlyReport(month, army_unit_id);
    res.status(200).json({ report: data });
  } catch (err) {
    console.error('Error fetching monthly report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
