const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
const memoryCache = new Map();
const memoryCacheTTL = new Map();

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    connectTimeout: 5000,
  });

  await redisClient.connect();

  redisClient.on('error', (err) => {
    logger.warn('Redis error (falling back to memory cache):', err.message);
    redisClient = null;
  });

  return redisClient;
};

const getCache = async (key) => {
  try {
    if (redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    logger.warn('Redis get error:', err.message);
  }

  // Fallback to memory cache
  const ttl = memoryCacheTTL.get(key);
  if (ttl && Date.now() > ttl) {
    memoryCache.delete(key);
    memoryCacheTTL.delete(key);
    return null;
  }
  return memoryCache.get(key) || null;
};

const setCache = async (key, value, ttlSeconds = 3600) => {
  try {
    if (redisClient) {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      return;
    }
  } catch (err) {
    logger.warn('Redis set error:', err.message);
  }

  // Fallback to memory cache
  memoryCache.set(key, value);
  memoryCacheTTL.set(key, Date.now() + ttlSeconds * 1000);

  // Cleanup old entries if cache grows too large
  if (memoryCache.size > 1000) {
    const firstKey = memoryCache.keys().next().value;
    memoryCache.delete(firstKey);
    memoryCacheTTL.delete(firstKey);
  }
};

const deleteCache = async (key) => {
  try {
    if (redisClient) {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.warn('Redis delete error:', err.message);
  }
  memoryCache.delete(key);
  memoryCacheTTL.delete(key);
};

const flushCache = async (pattern) => {
  try {
    if (redisClient) {
      const keys = await redisClient.keys(pattern || '*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }
  } catch (err) {
    logger.warn('Redis flush error:', err.message);
  }
  memoryCache.clear();
  memoryCacheTTL.clear();
};

module.exports = { connectRedis, getCache, setCache, deleteCache, flushCache };
