const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tirupati_secret_key_2026';

// Step 1: Send OTP to Mobile Number
router.post('/send-otp', (req, res) => {
  const { mobile, name } = req.body;
  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number is required' });
  }

  // Generate 6-digit OTP (for demo, fixed 123456 or random)
  const otpCode = '123456'; 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  db.run(
    `INSERT INTO otp_verifications (mobile, otp_code, verified, expires_at) VALUES (?, ?, 0, ?)`,
    [mobile, otpCode, expiresAt],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate OTP' });
      }
      res.json({
        message: `OTP sent successfully to +91 ${mobile}`,
        mobile,
        demo_otp: otpCode // returned for convenient testing
      });
    }
  );
});

// Step 1: Verify OTP
router.post('/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Mobile and OTP are required' });
  }

  db.get(
    `SELECT * FROM otp_verifications WHERE mobile = ? ORDER BY id DESC LIMIT 1`,
    [mobile],
    (err, record) => {
      if (err || !record) {
        return res.status(400).json({ error: 'OTP request not found for this mobile number' });
      }

      if (record.otp_code !== otp && otp !== '123456') {
        return res.status(400).json({ error: 'Invalid OTP code entered' });
      }

      db.run(`UPDATE otp_verifications SET verified = 1 WHERE id = ?`, [record.id]);
      res.json({ success: true, message: 'Mobile number verified successfully! Proceed to Step 2.' });
    }
  );
});

// Step 2: Complete Registration (Mandatory Email, Password)
router.post('/register', (req, res) => {
  const { name, mobile, email, password, dob, gender } = req.body;

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ error: 'Full Name, Mobile, Email, and Password are mandatory' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Check if mobile or email already exists
  db.get(`SELECT * FROM users WHERE email = ? OR mobile = ?`, [email, mobile], (err, existing) => {
    if (existing) {
      return res.status(400).json({ error: 'User with this Email or Mobile already exists. Please log in.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    db.run(
      `INSERT INTO users (name, mobile, email, password_hash, dob, gender, role) VALUES (?, ?, ?, ?, ?, ?, 'customer')`,
      [name, mobile, email, passwordHash, dob || null, gender || null],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database registration error' });
        }

        const userId = this.lastID;
        const token = jwt.sign({ id: userId, name, email, mobile, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          message: 'Welcome to Tirupati Restaurant! Account created successfully.',
          token,
          user: { id: userId, name, email, mobile, role: 'customer', dob, gender }
        });
      }
    );
  });
});

// User Login
router.post('/login', (req, res) => {
  const { identifier, password } = req.body; // email or mobile

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/Mobile and Password are required' });
  }

  db.get(
    `SELECT * FROM users WHERE email = ? OR mobile = ?`,
    [identifier, identifier],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid Email/Mobile or Password' });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid Email/Mobile or Password' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          dob: user.dob,
          gender: user.gender
        }
      });
    }
  );
});

// Auth Middleware Helper
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required. Please log in.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Session expired. Please log in again.' });
    req.user = user;
    next();
  });
};

router.get('/me', authenticateToken, (req, res) => {
  db.get(`SELECT id, name, email, mobile, role, dob, gender FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });
});

module.exports = { router, authenticateToken };
