const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all active blood requests
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        br.id,
        br.patient_name_or_code,
        br.blood_group_required,
        br.urgency_level,
        br.needed_by,
        br.location_description,
        br.contact_person_name,
        br.contact_phone,
        br.status,
        br.notes,
        br.created_at,
        h.name as hospital_name,
        h.id as hospital_id,
        COUNT(bdr.id) as responders_count
      FROM blood_requests br
      LEFT JOIN hospitals h ON br.hospital_id = h.id
      LEFT JOIN blood_donor_responses bdr ON br.id = bdr.blood_request_id
      WHERE br.status = 'ACTIVE'
      GROUP BY br.id, h.name, h.id
      ORDER BY 
        CASE br.urgency_level
          WHEN 'CRITICAL' THEN 1
          WHEN 'HIGH' THEN 2
          WHEN 'MEDIUM' THEN 3
          WHEN 'LOW' THEN 4
        END,
        br.needed_by ASC
      `
    );

    res.json({ requests: result.rows });
  } catch (err) {
    console.error('Error fetching blood requests:', err);
    res.status(500).json({ error: 'Failed to fetch blood requests', details: err.message });
  }
});

// Get single blood request
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        br.id,
        br.patient_name_or_code,
        br.blood_group_required,
        br.urgency_level,
        br.needed_by,
        br.location_description,
        br.contact_person_name,
        br.contact_phone,
        br.status,
        br.notes,
        br.created_at,
        h.name as hospital_name,
        h.id as hospital_id,
        COUNT(bdr.id) as responders_count
      FROM blood_requests br
      LEFT JOIN hospitals h ON br.hospital_id = h.id
      LEFT JOIN blood_donor_responses bdr ON br.id = bdr.blood_request_id
      WHERE br.id = $1
      GROUP BY br.id, h.name, h.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    res.json({ request: result.rows[0] });
  } catch (err) {
    console.error('Error fetching blood request:', err);
    res.status(500).json({ error: 'Failed to fetch blood request', details: err.message });
  }
});

// Respond to blood request (I Can Donate)
router.post('/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is a donor
    const donorCheck = await pool.query(
      'SELECT id FROM donors WHERE id = $1',
      [userId]
    );

    if (donorCheck.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Only registered donors can respond to blood requests',
        hint: 'Please register as a donor first'
      });
    }

    // Check if blood request exists and is active
    const requestCheck = await pool.query(
      'SELECT id, status FROM blood_requests WHERE id = $1',
      [id]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    if (requestCheck.rows[0].status !== 'ACTIVE') {
      return res.status(400).json({ error: 'This blood request is no longer active' });
    }

    // Check if already responded
    const existingResponse = await pool.query(
      'SELECT id FROM blood_donor_responses WHERE blood_request_id = $1 AND donor_id = $2',
      [id, userId]
    );

    if (existingResponse.rows.length > 0) {
      return res.status(400).json({ error: 'You have already responded to this request' });
    }

    // Create response
    const responseId = require('crypto').randomUUID();
    await pool.query(
      `INSERT INTO blood_donor_responses (id, blood_request_id, donor_id, status, responded_at)
       VALUES ($1, $2, $3, 'INTERESTED', now())`,
      [responseId, id, userId]
    );

    res.status(201).json({
      message: 'Thank you! Your response has been recorded. The hospital will contact you.',
      responseId,
    });
  } catch (err) {
    console.error('Error responding to blood request:', err);
    res.status(500).json({ error: 'Failed to respond to blood request', details: err.message });
  }
});

// Get stats
router.get('/stats/summary', async (req, res) => {
  try {
    const activeRequests = await pool.query(
      "SELECT COUNT(*) as count FROM blood_requests WHERE status = 'ACTIVE'"
    );
    
    const availableDonors = await pool.query(
      "SELECT COUNT(*) as count FROM donors WHERE availability = 'AVAILABLE'"
    );
    
    const fulfilledRequests = await pool.query(
      "SELECT COUNT(*) as count FROM blood_requests WHERE status = 'FULFILLED'"
    );

    res.json({
      activeRequests: parseInt(activeRequests.rows[0].count),
      availableDonors: parseInt(availableDonors.rows[0].count),
      livesSaved: parseInt(fulfilledRequests.rows[0].count),
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
});

module.exports = router;

