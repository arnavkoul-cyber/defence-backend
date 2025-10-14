exports.deleteUserByMobile = async (mobile_number) => {
  const [result] = await db.query('DELETE FROM users WHERE mobile_number = ?', [mobile_number]);
  return result;
};
exports.createUser = async (userData) => {
  // Build dynamic query based on provided fields
  const fields = Object.keys(userData);
  const values = Object.values(userData);
  const placeholders = fields.map(() => '?').join(',');
  const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`;
  const [result] = await db.query(sql, values);
  // Return the inserted user (with id)
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
  return rows[0];
};
const db = require('../config/db');

exports.findUserByMobile = async (mobile_number) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE mobile_number = ?`,
    [mobile_number]
  );
  return rows[0];
};

exports.findUserById = async (mobile_number) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE id = ?`,
    [mobile_number]
  );
  return rows[0];
};

exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};
