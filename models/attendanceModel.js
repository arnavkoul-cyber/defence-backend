const db = require('../config/db');

// Save attendance
exports.markAttendance = async ({ labour_id, army_unit_id, photo_path, attendance_date }) => {
  const [result] = await db.query(
    `INSERT INTO attendances (labour_id, army_unit_id, photo_path, attendance_date) 
     VALUES (?, ?, ?, ?)`,
    [labour_id, army_unit_id, photo_path, attendance_date]
  );
  return result.insertId;
};

// Get attendance by army unit
exports.getByArmyUnit = async (army_unit_id) => {
  const [rows] = await db.query(
    `SELECT a.*, l.name AS labour_name 
     FROM attendances a 
     JOIN labourers l ON a.labour_id = l.id 
     WHERE a.army_unit_id = ? 
     ORDER BY a.attendance_date DESC`,
    [army_unit_id]
  );
  return rows;
};

// Get attendance of one labour
exports.getByLabour = async (labour_id) => {
  const [rows] = await db.query(
    `SELECT * FROM attendances 
     WHERE labour_id = ? 
     ORDER BY attendance_date DESC`,
    [labour_id]
  );
  return rows;
};

// Filter by date for an army unit
exports.getByDate = async (army_unit_id, date) => {
  const [rows] = await db.query(
    `SELECT a.*, l.name AS labour_name 
     FROM attendances a 
     JOIN labourers l ON a.labour_id = l.id 
     WHERE a.army_unit_id = ? AND a.attendance_date = ?`,
    [army_unit_id, date]
  );
  return rows;
};
