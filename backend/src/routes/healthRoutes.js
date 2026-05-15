const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getAllEndpoints } = require('../services/apiHealthService');

router.get('/', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const apis = getAllEndpoints().map(e => ({
    name: e.name,
    healthy: e.healthy,
    failCount: e.failCount,
    lastCheck: e.lastCheck,
    responseTime: e.responseTime,
  }));

  res.json({
    success: true,
    status: 'operational',
    timestamp: new Date(),
    services: {
      database: dbStatus,
      apis,
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

module.exports = router;
