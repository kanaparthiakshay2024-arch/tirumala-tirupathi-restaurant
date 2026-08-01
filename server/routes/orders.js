const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Create New Order
router.post('/', authenticateToken, (req, res) => {
  const {
    house_no, street, area, city, pin_code, landmark,
    primary_mobile, secondary_mobile, delivery_instructions,
    distance_km, items, payment_method, coupon_code
  } = req.body;

  // Validation
  if (!house_no || !street || !area || !city || !pin_code || !primary_mobile) {
    return res.status(400).json({ error: 'All address fields and primary mobile number are required' });
  }

  // MANDATORY Secondary Mobile Number check
  if (!secondary_mobile || secondary_mobile.length < 10) {
    return res.status(400).json({ error: 'Secondary mobile number is MANDATORY for delivery coordination' });
  }

  // 100 km Delivery Radius check
  const distance = parseFloat(distance_km) || 8.5;
  if (distance > 100) {
    return res.status(400).json({ error: 'Sorry, delivery is only available within a 100 km radius of Tirupati Restaurant.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty' });
  }

  // Calculate totals
  let itemTotal = 0;
  items.forEach(item => {
    itemTotal += (item.price || 0) * (item.quantity || 1);
  });

  // Calculate GST (5%)
  const taxAmount = Math.round(itemTotal * 0.05);

  // Delivery fee calculation
  let deliveryFee = 30;
  if (distance > 5) {
    deliveryFee += Math.round((distance - 5) * 8);
  }

  // Discount
  let discountAmount = 0;
  if (coupon_code === 'TIRUPATI10' && itemTotal >= 300) {
    discountAmount = Math.min(Math.round(itemTotal * 0.10), 100);
  } else if (coupon_code === 'MAHABHOJ20' && itemTotal >= 600) {
    discountAmount = Math.min(Math.round(itemTotal * 0.20), 200);
  }

  const grandTotal = Math.max(0, itemTotal + taxAmount + deliveryFee - discountAmount);

  // Order Number generation
  const orderNumber = 'TR-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  const estTime = Math.min(60, Math.max(30, Math.round(distance * 3 + 25))) + ' Minutes';

  db.run(
    `INSERT INTO orders (
      order_number, user_id, user_name, house_no, street, area, city, pin_code, landmark,
      primary_mobile, secondary_mobile, delivery_instructions, distance_km, item_total,
      tax_amount, delivery_fee, discount_amount, grand_total, payment_method, payment_status,
      order_status, estimated_delivery_time, items_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed', 'Order Confirmed', ?, ?)`,
    [
      orderNumber, req.user.id, req.user.name, house_no, street, area, city, pin_code, landmark || '',
      primary_mobile, secondary_mobile, delivery_instructions || '', distance, itemTotal,
      taxAmount, deliveryFee, discountAmount, grandTotal, payment_method || 'UPI',
      estTime, JSON.stringify(items)
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to place order in database' });
      }

      res.status(201).json({
        message: 'Order placed successfully! Devotee feast will arrive soon.',
        orderId: this.lastID,
        order_number: orderNumber,
        grand_total: grandTotal,
        estimated_delivery_time: estTime
      });
    }
  );
});

// Get My Orders
router.get('/my-orders', authenticateToken, (req, res) => {
  db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
    const formatted = rows.map(r => ({
      ...r,
      items: JSON.parse(r.items_json || '[]')
    }));
    res.json(formatted);
  });
});

// Get Single Order Details for Live Tracking
router.get('/:id', authenticateToken, (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ? OR order_number = ?", [req.params.id, req.params.id], (err, order) => {
    if (err || !order) return res.status(404).json({ error: 'Order not found' });
    order.items = JSON.parse(order.items_json || '[]');
    res.json(order);
  });
});

// ADMIN: Get All Orders
router.get('/admin/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch all orders' });
    const formatted = rows.map(r => ({
      ...r,
      items: JSON.parse(r.items_json || '[]')
    }));
    res.json(formatted);
  });
});

// ADMIN: Update Order Status (Order Confirmed -> Preparing -> Packed -> Out for Delivery -> Delivered)
router.put('/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status } = req.body;
  const validStatuses = ['Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status transition' });
  }

  db.run("UPDATE orders SET order_status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update order status' });
    res.json({ message: `Order status updated to "${status}"`, status });
  });
});

// Cancel Order by User
router.post('/:id/cancel', authenticateToken, (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err, order) => {
    if (err || !order) return res.status(404).json({ error: 'Order not found' });

    if (order.order_status !== 'Order Confirmed') {
      return res.status(400).json({ error: 'Order cannot be cancelled as kitchen preparation has already begun.' });
    }

    db.run("UPDATE orders SET order_status = 'Cancelled' WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to cancel order' });
      res.json({ message: 'Order cancelled successfully.' });
    });
  });
});

module.exports = router;
