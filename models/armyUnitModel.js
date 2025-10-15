const db = require('../config/db');


exports.deleteArmyUnitByName = async (name) => {
  const [result] = await db.query('DELETE FROM army_units WHERE name = ?', [name]);
  return result;
};



exports.getAllArmyUnits = async () => {
  const [rows] = await db.query('SELECT * FROM army_units');
  return rows;
};

exports.createArmyUnit = async (name, sector_id) => {
  const [result] = await db.query(
    'INSERT INTO army_units (name, sector_id) VALUES (?, ?)',
    [name, sector_id]
  );
  const [rows] = await db.query('SELECT * FROM army_units WHERE id = ?', [result.insertId]);
  return rows[0];
};
