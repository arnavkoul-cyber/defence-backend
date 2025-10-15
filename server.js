const express = require('express');
const cors = require('cors');
require('dotenv').config();
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: [
    'https://dlp.jk.gov.in',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
const authRoutes = require('./routes/authRoutes')
const labourRoutes = require('./routes/labourRoutes');
const dynamicRoutes = require('./routes/dynamicRoutes');
const armyUnitRoutes = require('./routes/armyUnitRoutes');
const userRoutes = require('./routes/userRoutes');
const sectorRoutes = require('./routes/sectorRoutes');
app.use('/api/labour', labourRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/dynamic', dynamicRoutes);
app.use('/api/army-units', armyUnitRoutes);

app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sectors', sectorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
