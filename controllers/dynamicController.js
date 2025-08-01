const db = require('../config/db');

exports.getTableData = async (req, res) => {
  try {
    const { table } = req.params;

    // Security check (prevent SQL injection)
    const allowedTables = ['labourers', 'users', 'army_units', 'districts', 'sectors'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Table not allowed' });
    }

    const [rows] = await db.query(`SELECT * FROM ${table}`);

    res.status(200).json({
      table,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching table data:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
