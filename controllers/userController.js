// DELETE /api/users/:mobile_number
exports.deleteUserByMobile = async (req, res) => {
  try {
    const { mobile_number } = req.params;
    const result = await userModel.deleteUserByMobile(mobile_number);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};
const userModel = require('../models/userModel');


// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userModel.createUser(userData);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
};
