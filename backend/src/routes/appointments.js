const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { hospitalId, doctorId, requestedDateTime, notes } = req.body;
    const patientId = req.user.id;

    if (!hospitalId || !requestedDateTime) {
      return res.status(400).json({ error: 'Hospital ID and requested date/time are required' });
    }

    // Verify hospital exists
    const hospitalCheck = await pool.query('SELECT id FROM hospitals WHERE id = $1', [hospitalId]);
    if (hospitalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Verify doctor exists and belongs to hospital (if doctorId provided)
    // If doctor doesn't match, we'll create appointment without doctor (general appointment)
    let validDoctorId = null;
    if (doctorId) {
      const doctorCheck = await pool.query(
        'SELECT id FROM doctors WHERE id = $1 AND hospital_id = $2',
        [doctorId, hospitalId]
      );
      if (doctorCheck.rows.length > 0) {
        validDoctorId = doctorId;
      }
      // If doctor doesn't match, we'll proceed without doctor (general appointment at hospital)
    }

    // Create appointment
    const appointmentId = require('crypto').randomUUID();
    await pool.query(
      `INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, requested_date_time, scheduled_date_time, status, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $5, 'REQUESTED', $6, now())`,
      [appointmentId, patientId, validDoctorId, hospitalId, requestedDateTime, notes || null]
    );

    // Fetch created appointment with details
    const result = await pool.query(
      `SELECT 
        a.id,
        a.requested_date_time,
        a.scheduled_date_time,
        a.status,
        a.notes,
        a.created_at,
        h.name as hospital_name,
        u_doctor.name as doctor_name
      FROM appointments a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      LEFT JOIN users u_doctor ON a.doctor_id = u_doctor.id
      WHERE a.id = $1`,
      [appointmentId]
    );

    res.status(201).json({
      appointment: result.rows[0],
      message: 'Appointment requested successfully. The hospital will confirm your appointment.',
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment', details: err.message });
  }
});

// Get appointments for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        a.id,
        a.requested_date_time,
        a.scheduled_date_time,
        a.status,
        a.notes,
        a.created_at,
        h.name as hospital_name,
        h.id as hospital_id,
        u_doctor.name as doctor_name,
        u_doctor.id as doctor_id
      FROM appointments a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      LEFT JOIN users u_doctor ON a.doctor_id = u_doctor.id
      WHERE a.patient_id = $1
      ORDER BY a.requested_date_time DESC`,
      [userId]
    );

    res.json({ appointments: result.rows });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
});

// Get single appointment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        a.id,
        a.requested_date_time,
        a.scheduled_date_time,
        a.status,
        a.notes,
        a.created_at,
        h.name as hospital_name,
        h.id as hospital_id,
        u_doctor.name as doctor_name,
        u_doctor.id as doctor_id
      FROM appointments a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      LEFT JOIN users u_doctor ON a.doctor_id = u_doctor.id
      WHERE a.id = $1 AND a.patient_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment: result.rows[0] });
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ error: 'Failed to fetch appointment', details: err.message });
  }
});

module.exports = router;

