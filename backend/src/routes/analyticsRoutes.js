const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { protect } = require('../middleware/authMiddleware');

// GET /api/analytics/summary (protected)
router.get('/summary', protect, async (req, res, next) => {
  try {
    const now = new Date();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [todayCount, weekCount, totalCount, topDistricts] = await Promise.all([
      Analytics.countDocuments({ timestamp: { $gte: dayAgo } }),
      Analytics.countDocuments({ timestamp: { $gte: weekAgo } }),
      Analytics.countDocuments(),
      Analytics.aggregate([
        { $match: { type: 'individual_search', timestamp: { $gte: weekAgo } } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      success: true,
      data: { todayCount, weekCount, totalCount, topDistricts },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/analytics/track
router.post('/track', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (['page_view'].includes(type)) {
      await Analytics.create({ type, ...data, ip: req.ip });
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
