require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { startHealthCheck } = require('./services/apiHealthService');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('✅ MongoDB connected');

    // Connect to Redis (optional - graceful fallback)
    try {
      await connectRedis();
      logger.info('✅ Redis connected');
    } catch (err) {
      logger.warn('⚠️  Redis not available, using in-memory cache');
    }

    // Start API health monitoring
    startHealthCheck();

    app.listen(PORT, () => {
      logger.info(`🚀 Kerala SSLC Portal Backend running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
