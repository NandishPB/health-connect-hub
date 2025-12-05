const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, bloodGroup, hospitalName, city } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Map frontend role to database role
    const dbRole = role === 'hospital' ? 'HOSPITAL_ADMIN' : role.toUpperCase();

    // Generate user ID
    const userId = crypto.randomUUID();

    // Insert user
    await pool.query(
      `INSERT INTO users (id, name, email, phone, password_hash, role, city, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now())`,
      [userId, name, email, phone || null, passwordHash, dbRole, city || null]
    );

    // Handle role-specific data
    if (role === 'donor') {
      // Always create donor record, even if blood group is not provided
      await pool.query(
        `INSERT INTO donors (id, blood_group, availability)
         VALUES ($1, $2, 'AVAILABLE')
         ON CONFLICT (id) DO UPDATE SET blood_group = COALESCE($2, donors.blood_group)`,
        [userId, bloodGroup || null]
      );
    }

    if (role === 'hospital' && hospitalName) {
      const hospitalId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO hospitals (id, name, city, is_approved, created_by_user_id, created_at)
         VALUES ($1, $2, $3, false, $4, now())`,
        [hospitalId, hospitalName, city || null, userId]
      );
    }

    if (role === 'doctor') {
      await pool.query(
        `INSERT INTO doctors (id, name, is_active)
         VALUES ($1, $2, true)
         ON CONFLICT (id) DO UPDATE SET name = $2`,
        [userId, name]
      );
    }

    if (role === 'patient') {
      await pool.query(
        `INSERT INTO patients (id)
         VALUES ($1)
         ON CONFLICT (id) DO NOTHING`,
        [userId]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: dbRole },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role: dbRole.toLowerCase(),
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      res.status(503).json({ 
        error: 'Database connection failed', 
        details: 'PostgreSQL is not running. Please install and start PostgreSQL.',
        hint: 'See INSTALL_POSTGRES.md for setup instructions'
      });
    } else {
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      res.status(503).json({ 
        error: 'Database connection failed', 
        details: 'PostgreSQL is not running. Please install and start PostgreSQL.',
        hint: 'See INSTALL_POSTGRES.md for setup instructions'
      });
    } else {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role.toLowerCase(),
      },
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;

