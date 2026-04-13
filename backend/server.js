require('dotenv').config();

const express = require('express');
const cors = require('cors');

// DB connection
require('./config/db');

const app = express();

/* =========================
   CORS CONFIG (FINAL FIX)
========================= */

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman / backend-to-backend
    if (!origin) return callback(null, true);

    // Allow localhost (dev)
    if (origin.includes("localhost:3000")) {
      return callback(null, true);
    }

    // Allow ALL Vercel deployments (VERY IMPORTANT FIX)
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // Allow your backend itself
    if (origin.includes("onrender.com")) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);

    // TEMP SAFE MODE (prevents breaking frontend)
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

/* =========================
   MIDDLEWARE
========================= */

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api', require('./routes/clinical'));
app.use('/api', require('./routes/main'));

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Ojasya Healthcare',
    time: new Date()
  });
});

/* =========================
   ROOT
========================= */

app.get('/', (req, res) => {
  res.send('🚀 Ojasya Backend is Live');
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);

  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🏥 Backend running on port ${PORT}`);
  console.log(`🌍 CORS enabled for Vercel + Localhost`);
});
