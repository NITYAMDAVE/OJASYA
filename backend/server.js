require('dotenv').config();

const express = require('express');
const cors = require('cors');

// DB connection
require('./config/db');

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://ojasya-fa8v-2knzc1jgc-nityamdaves-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS FIRST
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================
   MIDDLEWARE
========================= */

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
  console.log(`🌍 Allowed Frontend: ${allowedOrigins}`);
});
