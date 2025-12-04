const express = require('express');
const cors = require('cors');
const { runSeed } = require('./seedRunner');
const { pool } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const prescriptionRoutes = require('./routes/prescriptions');
const bloodRequestRoutes = require('./routes/bloodRequests');
const appointmentRoutes = require('./routes/appointments');

app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/appointments', appointmentRoutes);

// Simple root route so visiting http://localhost:4000/ shows a friendly message
app.get('/', (req, res) => {
  res.send('ChikitsaVigyan backend running. Use /health or POST /api/seed for dev actions.');
});

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Protected endpoint intended for local/dev use only
app.post('/api/seed', async (req, res) => {
  try {
    await runSeed();
    res.json({ ok: true, message: 'Seed completed' });
  } catch (err) {
    console.error('Seed error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
