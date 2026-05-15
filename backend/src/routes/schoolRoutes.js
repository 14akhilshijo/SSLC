const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const School = require('../models/School');
const { getCache, setCache } = require('../config/redis');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// GET /api/schools/search?q=name_or_code
router.get('/search',
  [query('q').trim().notEmpty().withMessage('Search query required')],
  validate,
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const cacheKey = `school_search:${q}`;
      const cached = await getCache(cacheKey);
      if (cached) return res.json({ success: true, data: cached, fromCache: true });

      const schools = await School.find({
        $or: [
          { schoolCode: { $regex: q, $options: 'i' } },
          { schoolName: { $regex: q, $options: 'i' } },
          { district: { $regex: q, $options: 'i' } },
        ]
      }).limit(20).lean();

      await setCache(cacheKey, schools, 3600);
      res.json({ success: true, data: schools });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/schools/:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const cacheKey = `school_info:${code}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const school = await School.findOne({ schoolCode: code }).lean();
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });

    await setCache(cacheKey, school, 3600);
    res.json({ success: true, data: school });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
