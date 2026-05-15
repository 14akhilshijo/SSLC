const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const { flushCache } = require('../config/redis');
const Analytics = require('../models/Analytics');
const Result = require('../models/Result');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// GET /api/admin/dashboard (protected)
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const [totalResults, todaySearches, recentSearches] = await Promise.all([
      Result.countDocuments({ year: 2026 }),
      Analytics.countDocuments({
        type: 'individual_search',
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      Analytics.find({ type: 'individual_search' })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean(),
    ]);

    res.json({
      success: true,
      data: { totalResults, todaySearches, recentSearches },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/cache/flush (protected)
router.post('/cache/flush', protect, async (req, res, next) => {
  try {
    await flushCache('*');
    res.json({ success: true, message: 'Cache flushed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
