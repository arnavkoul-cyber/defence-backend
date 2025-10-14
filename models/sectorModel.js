const db = require('../config/db');

exports.getAllSectors = async () => {
  const [rows] = await db.query('SELECT * FROM sectors');
  return rows;
};

exports.createSector = async (name) => {
  const [result] = await db.query('INSERT INTO sectors (name) VALUES (?)', [name]);
  const [rows] = await db.query('SELECT * FROM sectors WHERE id = ?', [result.insertId]);
  return rows[0];
};
