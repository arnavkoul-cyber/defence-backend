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
    contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path
  } = labourData;

  const [result] = await db.query(
    `INSERT INTO labourers 
      (name, father_name, sector_id, contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, father_name, sector_id, contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path]
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
exports.getAssignedLaboursByMobile = async (mobileNumber) => {
  // Step 1: Get army_unit_id from users table
  const [userRows] = await db.query(
    'SELECT army_unit_id FROM users WHERE mobile_number = ?',
    [mobileNumber]
  );

  if (userRows.length === 0) {
    return null; // User not found
  }

  const armyUnitId = userRows[0].army_unit_id;

  // Step 2: Fetch labourers assigned to that army_unit_id
  const [labourRows] = await db.query(
    'SELECT id, name, contact_number, aadhaar_number FROM labourers WHERE army_unit_id = ?',
    [armyUnitId]
  );

  return labourRows;
};