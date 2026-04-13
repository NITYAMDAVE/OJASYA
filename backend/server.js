require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 🔹 DB Connection (make sure this file exists)
require('./config/db'); 

const app = express();

// 🔹 CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ojasya.onrender.com",
    "https://ojasya-j3t6-4nyni21c9-nityamdaves-projects.vercel.app"
  ],
  credentials: true
}));
// 🔹 Middleware
app.use(express.json());

// 🔹 Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api', require('./routes/clinical'));
app.use('/api', require('./routes/main'));

// 🔹 Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Ojasya Healthcare',
    time: new Date()
  });
});

// 🔹 Root Route (optional but useful)
app.get('/', (req, res) => {
  res.send('🚀 Ojasya Backend is Live');
});

// 🔹 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🏥 Ojasya Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
