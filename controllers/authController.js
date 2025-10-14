const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.loginWithJWT = async (req, res) => {
  try {
    const { mobile_number } = req.body;

    if (!mobile_number) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const user = await userModel.findUserByMobile(mobile_number);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        user_id: user.id,
        role_id: user.role_id,
        sector_id: user.sector_id,
        army_unit_id: user.army_unit_id,
        mobile_number: user.mobile_number,
        role: user.role // add role if present
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role_id: user.role_id,
        sector_id: user.sector_id,
        army_unit_id: user.army_unit_id,
        mobile_number: user.mobile_number,
        role: user.role // add role in response
      }
    });
  } catch (err) {
    console.error('JWT Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
