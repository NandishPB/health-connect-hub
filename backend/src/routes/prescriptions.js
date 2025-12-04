const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get prescriptions for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get prescriptions for this patient
    const result = await pool.query(
      `SELECT 
        p.id,
        p.diagnosis,
        p.created_at,
        p.doctor_id,
        p.hospital_id,
        u_doctor.name as doctor_name,
        h.name as hospital_name
      FROM prescriptions p
      LEFT JOIN users u_doctor ON p.doctor_id = u_doctor.id
      LEFT JOIN hospitals h ON p.hospital_id = h.id
      WHERE p.patient_id = $1
      ORDER BY p.created_at DESC`,
      [userId]
    );

    // Get prescription items for each prescription
    const prescriptions = await Promise.all(
      result.rows.map(async (prescription) => {
        const itemsResult = await pool.query(
          `SELECT 
            id,
            medicine_name,
            dosage,
            frequency,
            duration,
            instructions
          FROM prescription_items
          WHERE prescription_id = $1
          ORDER BY id`,
          [prescription.id]
        );

        // Check for medicine orders
        const orderResult = await pool.query(
          `SELECT 
            id,
            status,
            created_at
          FROM medicine_orders
          WHERE prescription_id = $1
          ORDER BY created_at DESC
          LIMIT 1`,
          [prescription.id]
        );

        return {
          id: prescription.id,
          diagnosis: prescription.diagnosis,
          createdAt: prescription.created_at,
          doctorName: prescription.doctor_name || 'Unknown Doctor',
          hospitalName: prescription.hospital_name || 'Unknown Hospital',
          items: itemsResult.rows.map(item => ({
            id: item.id,
            medicineName: item.medicine_name,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
          order: orderResult.rows.length > 0 ? {
            id: orderResult.rows[0].id,
            status: orderResult.rows[0].status,
            createdAt: orderResult.rows[0].created_at,
          } : null,
        };
      })
    );

    res.json({ prescriptions });
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).json({ error: 'Failed to fetch prescriptions', details: err.message });
  }
});

// Get single prescription by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        p.id,
        p.diagnosis,
        p.created_at,
        p.doctor_id,
        p.hospital_id,
        u_doctor.name as doctor_name,
        h.name as hospital_name
      FROM prescriptions p
      LEFT JOIN users u_doctor ON p.doctor_id = u_doctor.id
      LEFT JOIN hospitals h ON p.hospital_id = h.id
      WHERE p.id = $1 AND p.patient_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const prescription = result.rows[0];

    // Get items
    const itemsResult = await pool.query(
      `SELECT 
        id,
        medicine_name,
        dosage,
        frequency,
        duration,
        instructions
      FROM prescription_items
      WHERE prescription_id = $1
      ORDER BY id`,
      [id]
    );

    // Get order if exists
    const orderResult = await pool.query(
      `SELECT 
        id,
        status,
        created_at,
        updated_at
      FROM medicine_orders
      WHERE prescription_id = $1
      ORDER BY created_at DESC
      LIMIT 1`,
      [id]
    );

    res.json({
      prescription: {
        id: prescription.id,
        diagnosis: prescription.diagnosis,
        createdAt: prescription.created_at,
        doctorName: prescription.doctor_name || 'Unknown Doctor',
        hospitalName: prescription.hospital_name || 'Unknown Hospital',
        items: itemsResult.rows.map(item => ({
          id: item.id,
          medicineName: item.medicine_name,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions,
        })),
        order: orderResult.rows.length > 0 ? {
          id: orderResult.rows[0].id,
          status: orderResult.rows[0].status,
          createdAt: orderResult.rows[0].created_at,
          updatedAt: orderResult.rows[0].updated_at,
        } : null,
      },
    });
  } catch (err) {
    console.error('Error fetching prescription:', err);
    res.status(500).json({ error: 'Failed to fetch prescription', details: err.message });
  }
});

// Create medicine order from prescription
router.post('/:id/order', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { deliveryAddress, contactPhone } = req.body;

    // Verify prescription belongs to user
    const prescriptionCheck = await pool.query(
      'SELECT id FROM prescriptions WHERE id = $1 AND patient_id = $2',
      [id, userId]
    );

    if (prescriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Check if order already exists
    const existingOrder = await pool.query(
      'SELECT id FROM medicine_orders WHERE prescription_id = $1',
      [id]
    );

    if (existingOrder.rows.length > 0) {
      return res.status(400).json({ error: 'Order already exists for this prescription' });
    }

    // Get user address if not provided
    let finalAddress = deliveryAddress;
    let finalPhone = contactPhone;

    if (!finalAddress || !finalPhone) {
      const userResult = await pool.query(
        'SELECT address_line, phone FROM users WHERE id = $1',
        [userId]
      );
      if (userResult.rows.length > 0) {
        finalAddress = finalAddress || userResult.rows[0].address_line || '';
        finalPhone = finalPhone || userResult.rows[0].phone || '';
      }
    }

    // Create order
    const orderId = require('crypto').randomUUID();
    await pool.query(
      `INSERT INTO medicine_orders (id, patient_id, prescription_id, delivery_address, contact_phone, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', now())`,
      [orderId, userId, id, finalAddress, finalPhone]
    );

    // Create order items from prescription items
    const itemsResult = await pool.query(
      'SELECT id FROM prescription_items WHERE prescription_id = $1',
      [id]
    );

    for (const item of itemsResult.rows) {
      const orderItemId = require('crypto').randomUUID();
      await pool.query(
        `INSERT INTO medicine_order_items (id, order_id, prescription_item_id, quantity)
         VALUES ($1, $2, $3, 1)`,
        [orderItemId, orderId, item.id]
      );
    }

    res.status(201).json({
      order: {
        id: orderId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

module.exports = router;

