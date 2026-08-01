const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Add Item Review
router.post('/', authenticateToken, (req, res) => {
  const { menu_item_id, rating, comment, image_url } = req.body;

  if (!menu_item_id || !rating || !comment) {
    return res.status(400).json({ error: 'Menu item, star rating (1-5), and written comment are required' });
  }

  const numRating = parseInt(rating);
  if (numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  db.run(
    `INSERT INTO reviews (menu_item_id, user_name, rating, comment, image_url, likes_count, status)
     VALUES (?, ?, ?, ?, ?, 0, 'approved')`,
    [menu_item_id, req.user.name, numRating, comment, image_url || null],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to submit review' });

      // Update average rating for menu item
      db.get(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE menu_item_id = ? AND status = 'approved'",
        [menu_item_id],
        (err2, stats) => {
          if (stats) {
            const newAvg = Math.round((stats.avg_rating || 4.8) * 10) / 10;
            db.run(
              "UPDATE menu_items SET rating = ?, total_ratings = ? WHERE id = ?",
              [newAvg, stats.count, menu_item_id]
            );
          }
        }
      );

      res.status(201).json({ message: 'Review submitted successfully! Thank you for your feedback.' });
    }
  );
});

// Like a Review
router.post('/:id/like', (req, res) => {
  db.run("UPDATE reviews SET likes_count = likes_count + 1 WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to like review' });
    res.json({ message: 'Liked review!' });
  });
});

// Post-Order / Post-Visit Feedback Popup Handler
router.post('/feedback', authenticateToken, (req, res) => {
  const { order_id, food_quality, taste, hygiene, delivery, service, overall, comments } = req.body;

  db.run(
    `INSERT INTO feedback (order_id, user_id, user_name, food_quality, taste, hygiene, delivery, service, overall, comments)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order_id || null, req.user.id, req.user.name,
      food_quality || 5, taste || 5, hygiene || 5, delivery || 5, service || 5, overall || 5,
      comments || ''
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to submit feedback' });
      res.status(201).json({ message: 'Thank you for dining with Tirupati Restaurant! Your feedback helps us serve you better.' });
    }
  );
});

// ADMIN: Get all reviews for moderation
router.get('/admin/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.all(
    `SELECT r.*, m.name as item_name FROM reviews r JOIN menu_items m ON r.menu_item_id = m.id ORDER BY r.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch reviews' });
      res.json(rows);
    }
  );
});

module.exports = router;
