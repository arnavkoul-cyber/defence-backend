// Get report for a date range
exports.getRangeReport = async (start_date, end_date, army_unit_id) => {
  let query = `
    SELECT l.id AS labour_id, l.name AS labour_name, l.labour_type,
      COUNT(DISTINCT a.attendance_date) AS working_days
    FROM labourers l
    LEFT JOIN attendances a ON a.labour_id = l.id
      AND a.attendance_date BETWEEN ? AND ?
  `;
  const params = [start_date, end_date];
  if (army_unit_id) {
    query += ` WHERE a.army_unit_id = ?`;
    params.push(army_unit_id);
  }
  query += ` GROUP BY l.id, l.name, l.labour_type ORDER BY l.name`;
  const [rows] = await db.query(query, params);
  return rows;
};
const db = require('../config/db');
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
  await db.query(`UPDATE attendances SET status = 0 WHERE attendance_date < CURDATE()`);
  console.log("Reset attendance status for previous days");
});


// Save attendance
exports.markAttendance = async ({ labour_id, army_unit_id, photo_path, attendance_date,status }) => {
  const [result] = await db.query(
    `INSERT INTO attendances (labour_id, army_unit_id, photo_path, attendance_date,status) 
     VALUES (?, ?, ?, ?,?)`,
    [labour_id, army_unit_id, photo_path, attendance_date,status]
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

// month: YYYY-MM, optional army_unit_id
exports.getMonthlyReport = async (month, army_unit_id) => {
  // Compute start and end dates for the month
  const startDate = `${month}-01`;
  // use LAST_DAY in query to compute end

  let query = `
    SELECT l.id AS labour_id, l.name AS labour_name, l.labour_type,
      COUNT(DISTINCT a.attendance_date) AS working_days
    FROM labourers l
    LEFT JOIN attendances a ON a.labour_id = l.id
      AND DATE_FORMAT(a.attendance_date, '%Y-%m') = ?
  `;

  const params = [month];

  if (army_unit_id) {
    query += ` WHERE a.army_unit_id = ?`;
    params.push(army_unit_id);
  }

  query += ` GROUP BY l.id, l.name, l.labour_type ORDER BY l.name`;

  const [rows] = await db.query(query, params);
  return rows;
};
