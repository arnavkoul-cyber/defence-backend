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
