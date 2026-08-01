const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Middleware to enforce Admin role
const requireAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'chef')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin credentials required.' });
  }
};

// Admin Summary Analytics
router.get('/summary', authenticateToken, requireAdmin, (req, res) => {
  db.get("SELECT COUNT(*) as total_orders, SUM(grand_total) as total_revenue FROM orders WHERE order_status != 'Cancelled'", [], (err, orderStats) => {
    db.get("SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'", [], (err2, userStats) => {
      db.get("SELECT COUNT(*) as total_reservations FROM table_reservations WHERE status = 'Confirmed'", [], (err3, resStats) => {
        db.get("SELECT COUNT(*) as total_dishes FROM menu_items", [], (err4, dishStats) => {
          res.json({
            total_orders: orderStats ? orderStats.total_orders || 0 : 0,
            total_revenue: orderStats ? Math.round(orderStats.total_revenue || 0) : 0,
            total_customers: userStats ? userStats.total_customers || 0 : 0,
            active_reservations: resStats ? resStats.total_reservations || 0 : 0,
            total_dishes: dishStats ? dishStats.total_dishes || 0 : 0,
            restaurant_info: {
              name: 'Tirupati Restaurant',
              owner: 'Rachakonda Mithrakumar',
              manager: 'Kanaparthi Akshay',
              chief_chef: 'Koppula Koteshwar Rao',
              contacts: ['+91 9346174197', '+91 9014228068', '+91 8247467209'],
              email: 'tirumaltirupatirestarent@gmail.com'
            }
          });
        });
      });
    });
  });
});

// Coupon validation
router.post('/coupons/validate', (req, res) => {
  const { code, amount } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  db.get("SELECT * FROM coupons WHERE code = ? AND active = 1", [code.toUpperCase()], (err, coupon) => {
    if (err || !coupon) return res.status(404).json({ error: 'Invalid or expired coupon code' });

    if (amount < coupon.min_order) {
      return res.status(400).json({ error: `Minimum order amount of ₹${coupon.min_order} required for code ${coupon.code}` });
    }

    const discount = Math.min((amount * coupon.discount_percent) / 100, coupon.max_discount);
    res.json({
      valid: true,
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      discount_amount: Math.round(discount),
      message: `Coupon ${coupon.code} applied! You saved ₹${Math.round(discount)}`
    });
  });
});

module.exports = router;
