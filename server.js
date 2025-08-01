const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
const authRoutes = require('./routes/authRoutes')
const labourRoutes = require('./routes/labourRoutes');
const dynamicRoutes = require('./routes/dynamicRoutes');
app.use('/api/labour', labourRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/dynamic', dynamicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
