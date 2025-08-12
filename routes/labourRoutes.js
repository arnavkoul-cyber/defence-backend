const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `labour_${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

router.post(
  '/register',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'adhar', maxCount: 1 },
  ]),
  labourController.registerLabour
);
router.delete('/:id', labourController.deleteLabour);
router.get('/:officer_id', labourController.laboursList);
router.post('/assign-army-unit', labourController.assignArmyUnit);

router.get('/assigned/:mobile_number', labourController.getAssignedLaboursByMobile);


module.exports = router;
