require('dotenv').config();

const express = require('express');
const cors = require('cors');

// DB Connection
require('./config/db');

const app = express();

// 🔹 Allowed Origins (UPDATED WITH YOUR VERCEL URL)
const allowedOrigins = [
  "http://localhost:3000",
  "https://ojasya-fa8v-2knzc1jgc-nityamdaves-projects.vercel.app"
];

// 🔹 CORS FIX (production + login route support)
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-vercel-app.vercel.app" // replace with actual frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow Postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// IMPORTANT: use SAME options here
app.options("*", cors(corsOptions));
// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api', require('./routes/clinical'));
app.use('/api', require('./routes/main'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Ojasya Healthcare',
    time: new Date()
  });
});

// Root
app.get('/', (req, res) => {
  res.send('🚀 Ojasya Backend is Live');
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);

  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🏥 Backend running on port ${PORT}`);
  console.log(`🌍 Frontend allowed: https://ojasya-fa8v-2knzc1jgc-nityamdaves-projects.vercel.app`);
});
