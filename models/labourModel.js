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
    contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path, labour_type,
    pan_number, pan_path
  } = labourData;

  const [result] = await db.query(
    `INSERT INTO labourers 
      (name, father_name, sector_id, contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path, labour_type, pan_number, pan_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, father_name, sector_id, contact_number, aadhaar_number, photo_path, status, bank_name, bank_account_no, bank_ifsc_code, adhar_path, labour_type, pan_number, pan_path]
  );

  return result.insertId;
};

exports.laboursByOfficer = async (id) => {
  const [rows] = await db.query(
    `SELECT labourers.*, labourers.pan_number, labourers.pan_path FROM users
    JOIN labourers ON users.sector_id = labourers.sector_id
    WHERE users.id=?`,
    [id]
  );
  return rows;
};

// exports.assignArmyUnits = async (army_unit_id,labour_ids) => {
//     try{
//         const [result] = await db.query(
//         `UPDATE labourers 
//         SET army_unit_id = ? 
//         WHERE id IN (?)`,
//         [army_unit_id, labour_ids]
//         );
//         return result
//     }catch(err){
//         throw(err);
//     }
  
// };
exports.assignArmyUnits = async ({ army_unit_id, labour_ids, start_date, end_date, assigned_by, status, remarks }) => {
  try {
    const fields = [];
    const values = [];

    if (army_unit_id !== undefined) {
      fields.push("army_unit_id = ?");
      values.push(army_unit_id);
    }
    if (start_date !== undefined) {
      fields.push("start_date = ?");
      values.push(start_date);
    }
    if (end_date !== undefined) {
      fields.push("end_date = ?");
      values.push(end_date);
    }
    if (assigned_by !== undefined) {
      fields.push("assigned_by = ?");
      values.push(assigned_by);
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
   if (remarks !== undefined) {
      fields.push("remarks = ?");
      values.push(remarks);
    }
    if (fields.length === 0) {
      throw new Error("No fields provided to update.");
    }

    // Add labour_ids for WHERE condition
    values.push(labour_ids);

    const query = `
      UPDATE labourers
      SET ${fields.join(", ")}
      WHERE id IN (?)
    `;

    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw err;
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
    'SELECT id, name, contact_number, start_date, end_date, photo_path, pan_number, pan_path FROM labourers WHERE army_unit_id = ?',
    [armyUnitId]
  );

  return labourRows;
};

// Delete a labour by id
exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM labourers WHERE id = ?', [id]);
  return result;
};