const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Create Table Reservation
router.post('/', authenticateToken, (req, res) => {
  const { res_date, res_time, guests, seating_preference, special_occasion } = req.body;

  if (!res_date || !res_time || !guests) {
    return res.status(400).json({ error: 'Date, Time, and Guest count are required' });
  }

  const resCode = 'TBL-' + Math.floor(1000 + Math.random() * 9000);

  db.run(
    `INSERT INTO table_reservations (
      reservation_code, user_id, user_name, user_mobile, res_date, res_time,
      guests, seating_preference, special_occasion, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')`,
    [
      resCode, req.user.id, req.user.name, req.user.mobile, res_date, res_time,
      parseInt(guests), seating_preference || 'Indoor', special_occasion || 'Dining'
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to complete table reservation' });

      res.status(201).json({
        message: 'Table reserved successfully! We look forward to welcoming you to Tirupati Restaurant.',
        reservationId: this.lastID,
        reservation_code: resCode,
        details: {
          res_date, res_time, guests, seating_preference, reservation_code: resCode
        }
      });
    }
  );
});

// Get User's Reservations
router.get('/my-reservations', authenticateToken, (req, res) => {
  db.all("SELECT * FROM table_reservations WHERE user_id = ? ORDER BY id DESC", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch reservations' });
    res.json(rows);
  });
});

// ADMIN: Get All Reservations
router.get('/admin/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.all("SELECT * FROM table_reservations ORDER BY res_date DESC, res_time ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch all reservations' });
    res.json(rows);
  });
});

// ADMIN: Update Reservation Status
router.put('/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status } = req.body;
  db.run("UPDATE table_reservations SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update reservation status' });
    res.json({ message: `Reservation status updated to ${status}` });
  });
});

module.exports = router;
