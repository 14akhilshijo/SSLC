const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const { getIndividualResult, getSchoolResults, getStatistics } = require('../services/resultService');
const { generateMarkSheet } = require('../services/pdfService');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/results/individual
router.get('/individual',
  [
    query('regno').trim().notEmpty().withMessage('Register number is required')
      .matches(/^[A-Za-z0-9]+$/).withMessage('Invalid register number format'),
    query('dob').trim().notEmpty().withMessage('Date of birth is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('DOB must be YYYY-MM-DD'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { regno, dob } = req.query;
      const result = await getIndividualResult(regno.toUpperCase(), dob, req.ip);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/results/school
router.get('/school',
  [
    query('code').trim().notEmpty().withMessage('School code is required'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { code, page = 1, limit = 20 } = req.query;
      const result = await getSchoolResults(code, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/results/statistics
router.get('/statistics', async (req, res, next) => {
  try {
    const stats = await getStatistics();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/results/pdf
router.get('/pdf',
  [
    query('regno').trim().notEmpty(),
    query('dob').trim().notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { regno, dob } = req.query;
      const result = await getIndividualResult(regno.toUpperCase(), dob, req.ip);
      const pdfBuffer = await generateMarkSheet(result);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SSLC_${regno}_2026.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
