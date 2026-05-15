const axios = require('axios');
const logger = require('../utils/logger');

// API endpoints with priority order
const API_ENDPOINTS = [
  {
    name: 'primary',
    url: process.env.KERALA_SSLC_API_PRIMARY || 'https://api.keralaresults.nic.in/sslc2026',
    priority: 1,
    healthy: true,
    lastCheck: null,
    failCount: 0,
  },
  {
    name: 'mirror1',
    url: process.env.KERALA_SSLC_API_MIRROR1 || 'https://results.kerala.gov.in/api/sslc',
    priority: 2,
    healthy: true,
    lastCheck: null,
    failCount: 0,
  },
  {
    name: 'mirror2',
    url: process.env.KERALA_SSLC_API_MIRROR2 || 'https://keralaresults.nic.in/sslc',
    priority: 3,
    healthy: true,
    lastCheck: null,
    failCount: 0,
  },
];

let healthCheckInterval = null;

const checkEndpointHealth = async (endpoint) => {
  const start = Date.now();
  try {
    await axios.get(`${endpoint.url}/health`, {
      timeout: 5000,
      headers: { 'X-API-Key': process.env.KERALA_SSLC_API_KEY || '' },
    });
    endpoint.healthy = true;
    endpoint.failCount = 0;
    endpoint.responseTime = Date.now() - start;
  } catch (err) {
    endpoint.failCount++;
    endpoint.responseTime = Date.now() - start;
    if (endpoint.failCount >= 3) {
      endpoint.healthy = false;
      logger.warn(`API endpoint ${endpoint.name} marked unhealthy after ${endpoint.failCount} failures`);
    }
  }
  endpoint.lastCheck = new Date();
};

const startHealthCheck = () => {
  // Check every 2 minutes
  healthCheckInterval = setInterval(async () => {
    for (const endpoint of API_ENDPOINTS) {
      await checkEndpointHealth(endpoint);
    }
  }, 2 * 60 * 1000);

  // Initial check
  setTimeout(async () => {
    for (const endpoint of API_ENDPOINTS) {
      await checkEndpointHealth(endpoint);
    }
  }, 5000);
};

const getHealthyEndpoints = () => {
  return API_ENDPOINTS
    .filter(e => e.healthy)
    .sort((a, b) => a.priority - b.priority);
};

const getAllEndpoints = () => API_ENDPOINTS;

const markEndpointUnhealthy = (name) => {
  const endpoint = API_ENDPOINTS.find(e => e.name === name);
  if (endpoint) {
    endpoint.failCount++;
    if (endpoint.failCount >= 2) {
      endpoint.healthy = false;
    }
  }
};

const markEndpointHealthy = (name) => {
  const endpoint = API_ENDPOINTS.find(e => e.name === name);
  if (endpoint) {
    endpoint.healthy = true;
    endpoint.failCount = 0;
  }
};

module.exports = {
  startHealthCheck,
  getHealthyEndpoints,
  getAllEndpoints,
  markEndpointUnhealthy,
  markEndpointHealthy,
};
