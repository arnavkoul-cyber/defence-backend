const db = require('../config/db');

exports.checkDuplicate = async (aadhaar, phone) => {
  const [rows] = await db.query(
    `SELECT id FROM labourers WHERE aadhaar_number = ? OR contact_number = ?`,
    [aadhaar, phone]
  );
  return rows.length > 0;
};

exports.registerLabour = async (labourData) => {
  const {
    name, father_name, sector_id,
    contact_number, aadhaar_number, photo_path
  } = labourData;

  const [result] = await db.query(
    `INSERT INTO labourers 
      (name, father_name, sector_id, contact_number, aadhaar_number, photo_path)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, father_name, sector_id, contact_number, aadhaar_number, photo_path]
  );

  return result.insertId;
};

exports.laboursByOfficer = async (id) => {
  const [rows] = await db.query(
    `select labourers.* from users
    join labourers on users.sector_id = labourers.sector_id
    where users.id=?`,
    [id]
  );
  return rows;
};

exports.assignArmyUnits = async (army_unit_id,labour_ids) => {
    try{
        const [result] = await db.query(
        `UPDATE labourers 
        SET army_unit_id = ? 
        WHERE id IN (?)`,
        [army_unit_id, labour_ids]
        );
        return result
    }catch(err){
        throw(err);
    }
  
};
