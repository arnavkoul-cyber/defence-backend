const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `attendance_${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Routes
router.post('/mark', upload.single('photo'), attendanceController.markAttendance);
router.get('/army/:army_unit_id', attendanceController.getByArmyUnit);
router.get('/labour/:labour_id', attendanceController.getByLabour);
router.get('/filter', attendanceController.getByDate);

module.exports = router;
