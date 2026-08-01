const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Get all categories
router.get('/categories', (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch categories' });
    res.json(rows);
  });
});

// Get all menu items with search & category filter
router.get('/items', (req, res) => {
  const { category, search } = req.query;
  let sql = "SELECT * FROM menu_items WHERE available = 1";
  const params = [];

  if (category && category !== 'all') {
    sql += " AND category_slug = ?";
    params.push(category);
  }

  if (search) {
    sql += " AND (name LIKE ? OR description LIKE ? OR ingredients LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += " ORDER BY is_daily_special DESC, rating DESC";

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch menu items' });
    res.json(rows);
  });
});

// Get Today's Daily Special Dish
router.get('/daily-special', (req, res) => {
  db.get("SELECT * FROM menu_items WHERE is_daily_special = 1 LIMIT 1", [], (err, item) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch daily special' });
    if (!item) {
      // Fallback to Srivari Maha Bhojanam or first item
      db.get("SELECT * FROM menu_items LIMIT 1", [], (err2, fallback) => {
        return res.json(fallback);
      });
    } else {
      res.json(item);
    }
  });
});

// Get Worship Offerings (Naivedyam)
router.get('/naivedyam', (req, res) => {
  db.all("SELECT * FROM menu_items WHERE category_slug = 'naivedyam'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch worship offerings' });
    res.json(rows);
  });
});

// Get Single Food Details by ID with Reviews & Similar Dishes
router.get('/items/:id', (req, res) => {
  const itemId = req.params.id;

  db.get("SELECT * FROM menu_items WHERE id = ?", [itemId], (err, item) => {
    if (err || !item) return res.status(404).json({ error: 'Food item not found' });

    // Fetch reviews
    db.all("SELECT * FROM reviews WHERE menu_item_id = ? AND status = 'approved' ORDER BY id DESC", [itemId], (err2, reviews) => {
      // Fetch similar dishes in same category
      db.all(
        "SELECT * FROM menu_items WHERE category_slug = ? AND id != ? LIMIT 4",
        [item.category_slug, itemId],
        (err3, similar) => {
          res.json({
            ...item,
            reviews: reviews || [],
            similar_dishes: similar || []
          });
        }
      );
    });
  });
});

// ADMIN: Set Daily Special Dish
router.post('/daily-special/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const itemId = req.params.id;

  // Reset existing daily special
  db.run("UPDATE menu_items SET is_daily_special = 0", [], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update daily special' });

    // Set new daily special
    db.run("UPDATE menu_items SET is_daily_special = 1 WHERE id = ?", [itemId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to set daily special' });
      res.json({ message: 'Daily Special Dish updated successfully!' });
    });
  });
});

// ADMIN: Add New Menu Item
router.post('/items', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const {
    category_slug, name, description, price, offer_price, image_url,
    ingredients, allergens, calories, preparation_style, worship_significance
  } = req.body;

  if (!category_slug || !name || !description || !price || !image_url) {
    return res.status(400).json({ error: 'All primary fields (category, name, description, price, image) are required' });
  }

  db.run(
    `INSERT INTO menu_items (
      category_slug, name, description, price, offer_price, image_url,
      is_veg, is_daily_special, rating, total_ratings, ingredients,
      allergens, calories, preparation_style, worship_significance, available
    ) VALUES (?, ?, ?, ?, ?, ?, 1, 0, 4.8, 10, ?, ?, ?, ?, ?, 1)`,
    [category_slug, name, description, price, offer_price || null, image_url, ingredients, allergens, calories || 300, preparation_style, worship_significance],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to insert menu item' });
      res.status(201).json({ message: 'New menu item added successfully!', itemId: this.lastID });
    }
  );
});

// ADMIN: Edit Menu Item
router.put('/items/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const itemId = req.params.id;
  const { name, description, price, offer_price, image_url, available, ingredients, allergens, calories } = req.body;

  db.run(
    `UPDATE menu_items SET name = ?, description = ?, price = ?, offer_price = ?, image_url = ?, available = ?, ingredients = ?, allergens = ?, calories = ? WHERE id = ?`,
    [name, description, price, offer_price || null, image_url, available !== undefined ? available : 1, ingredients, allergens, calories, itemId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update menu item' });
      res.json({ message: 'Menu item updated successfully!' });
    }
  );
});

// ADMIN: Delete Menu Item
router.delete('/items/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  db.run("DELETE FROM menu_items WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete menu item' });
    res.json({ message: 'Menu item deleted successfully!' });
  });
});

module.exports = router;
