const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const QRCode = require('qrcode');
const { getCache, setCache } = require('../config/redis');
const { getHealthyEndpoints, markEndpointUnhealthy, markEndpointHealthy } = require('./apiHealthService');
const Result = require('../models/Result');
const Analytics = require('../models/Analytics');
const logger = require('../utils/logger');

// Configure axios with retry
const apiClient = axios.create({ timeout: 10000 });
axiosRetry(apiClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && error.response.status >= 500);
  },
});

const CACHE_TTL = parseInt(process.env.RESULT_CACHE_TTL) || 86400;

// Grade calculation
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'E';
};

const getSubjectGrade = (marks, maxMarks = 100) => {
  const pct = (marks / maxMarks) * 100;
  return calculateGrade(pct);
};

// Generate mock result for demo/fallback
const generateMockResult = (registerNumber, dob) => {
  const subjects = [
    { code: '01', name: 'Malayalam', theory: 72, practical: 0, total: 72 },
    { code: '02', name: 'English', theory: 85, practical: 0, total: 85 },
    { code: '03', name: 'Hindi', theory: 68, practical: 0, total: 68 },
    { code: '04', name: 'Mathematics', theory: 92, practical: 0, total: 92 },
    { code: '05', name: 'Physics', theory: 78, practical: 20, total: 98 },
    { code: '06', name: 'Chemistry', theory: 75, practical: 20, total: 95 },
    { code: '07', name: 'Biology', theory: 80, practical: 20, total: 100 },
    { code: '08', name: 'Social Science', theory: 88, practical: 0, total: 88 },
    { code: '09', name: 'IT', theory: 45, practical: 45, total: 90 },
  ];

  const processedSubjects = subjects.map(s => ({
    ...s,
    grade: getSubjectGrade(s.total, s.code === '05' || s.code === '06' || s.code === '07' ? 120 : (s.code === '09' ? 90 : 100)),
    isAPlus: s.total >= 90,
  }));

  const totalMarks = processedSubjects.reduce((sum, s) => sum + s.total, 0);
  const maxMarks = 788;
  const percentage = Math.round((totalMarks / maxMarks) * 100 * 10) / 10;
  const aPlusCount = processedSubjects.filter(s => s.isAPlus).length;

  return {
    registerNumber,
    dateOfBirth: dob,
    studentName: 'DEMO STUDENT',
    schoolCode: 'DEMO001',
    schoolName: 'Demo Government Higher Secondary School',
    district: 'Thiruvananthapuram',
    subjects: processedSubjects,
    totalMarks,
    maxMarks,
    percentage,
    result: 'PASS',
    grade: calculateGrade(percentage),
    aPlusCount,
    year: 2026,
    source: 'demo',
  };
};

// Fetch from official API with failover
const fetchFromAPI = async (registerNumber, dob) => {
  const endpoints = getHealthyEndpoints();

  if (endpoints.length === 0) {
    logger.warn('All API endpoints unhealthy, using demo data');
    return generateMockResult(registerNumber, dob);
  }

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await apiClient.get(`${endpoint.url}/result`, {
        params: { regno: registerNumber, dob },
        headers: {
          'X-API-Key': process.env.KERALA_SSLC_API_KEY || '',
          'Accept': 'application/json',
        },
      });

      markEndpointHealthy(endpoint.name);
      logger.info(`Result fetched from ${endpoint.name} in ${Date.now() - start}ms`);

      return transformAPIResponse(response.data, registerNumber, dob);
    } catch (err) {
      logger.warn(`API ${endpoint.name} failed: ${err.message}`);
      markEndpointUnhealthy(endpoint.name);
    }
  }

  // All APIs failed - return demo data
  logger.warn('All APIs failed, returning demo data');
  return generateMockResult(registerNumber, dob);
};

// Transform raw API response to our schema
const transformAPIResponse = (data, registerNumber, dob) => {
  if (!data || !data.studentName) {
    throw new Error('Invalid API response format');
  }

  const subjects = (data.subjects || []).map(s => ({
    code: s.subjectCode || s.code,
    name: s.subjectName || s.name,
    theory: s.theoryMarks || s.theory || 0,
    practical: s.practicalMarks || s.practical || 0,
    total: s.totalMarks || s.total || 0,
    grade: s.grade || getSubjectGrade(s.totalMarks || s.total || 0),
    isAPlus: (s.grade === 'A+') || ((s.totalMarks || s.total || 0) >= 90),
  }));

  const totalMarks = subjects.reduce((sum, s) => sum + s.total, 0);
  const maxMarks = data.maxMarks || 600;
  const percentage = Math.round((totalMarks / maxMarks) * 100 * 10) / 10;

  return {
    registerNumber,
    dateOfBirth: dob,
    studentName: data.studentName,
    schoolCode: data.schoolCode,
    schoolName: data.schoolName,
    district: data.district,
    subjects,
    totalMarks,
    maxMarks,
    percentage,
    result: data.result || (totalMarks >= (maxMarks * 0.3) ? 'PASS' : 'FAIL'),
    grade: calculateGrade(percentage),
    aPlusCount: subjects.filter(s => s.isAPlus).length,
    year: 2026,
    source: 'api',
  };
};

// Main: Get individual result
const getIndividualResult = async (registerNumber, dob, ip) => {
  const cacheKey = `result:${registerNumber}:${dob}`;
  const start = Date.now();

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    logger.info(`Cache hit for ${registerNumber}`);
    await logAnalytics('individual_search', { registerNumber, ip, success: true, responseTime: Date.now() - start, apiSource: 'cache' });
    return { ...cached, fromCache: true };
  }

  // Check DB
  try {
    const dbResult = await Result.findOne({ registerNumber: registerNumber.toUpperCase(), year: 2026 });
    if (dbResult) {
      const resultObj = dbResult.toJSON();
      await setCache(cacheKey, resultObj, CACHE_TTL);
      await logAnalytics('individual_search', { registerNumber, ip, success: true, responseTime: Date.now() - start, apiSource: 'database' });
      return { ...resultObj, fromCache: false };
    }
  } catch (dbErr) {
    logger.warn('DB lookup failed:', dbErr.message);
  }

  // Fetch from API
  const resultData = await fetchFromAPI(registerNumber, dob);

  // Generate QR code
  try {
    const qrData = JSON.stringify({
      reg: registerNumber,
      name: resultData.studentName,
      result: resultData.result,
      year: 2026,
      verify: `https://sslc.akhilshijoinnov.site/verify/${registerNumber}`,
    });
    resultData.qrCode = await QRCode.toDataURL(qrData, { width: 200, margin: 1 });
  } catch (qrErr) {
    logger.warn('QR generation failed:', qrErr.message);
  }

  // Save to DB
  try {
    await Result.findOneAndUpdate(
      { registerNumber: registerNumber.toUpperCase(), year: 2026 },
      { ...resultData, fetchedAt: new Date() },
      { upsert: true, new: true }
    );
  } catch (dbErr) {
    logger.warn('DB save failed:', dbErr.message);
  }

  // Cache result
  await setCache(cacheKey, resultData, CACHE_TTL);

  await logAnalytics('individual_search', {
    registerNumber,
    ip,
    success: true,
    responseTime: Date.now() - start,
    apiSource: resultData.source,
  });

  return resultData;
};

// Get school results
const getSchoolResults = async (schoolCode, page = 1, limit = 20) => {
  const cacheKey = `school:${schoolCode}:${page}:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  try {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      Result.find({ schoolCode, year: 2026 })
        .select('registerNumber studentName totalMarks percentage result grade aPlusCount')
        .sort({ totalMarks: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments({ schoolCode, year: 2026 }),
    ]);

    const passed = await Result.countDocuments({ schoolCode, year: 2026, result: 'PASS' });
    const totalAPlus = await Result.aggregate([
      { $match: { schoolCode, year: 2026 } },
      { $group: { _id: null, total: { $sum: '$aPlusCount' } } },
    ]);

    const data = {
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total,
        passed,
        failed: total - passed,
        passPercentage: total > 0 ? Math.round((passed / total) * 100 * 10) / 10 : 0,
        totalAPlus: totalAPlus[0]?.total || 0,
      },
    };

    await setCache(cacheKey, data, 3600);
    return data;
  } catch (err) {
    logger.error('School results fetch error:', err);
    throw err;
  }
};

// Get overall statistics
const getStatistics = async () => {
  const cacheKey = 'stats:overall:2026';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    const [total, passed, districtStats, aPlusData] = await Promise.all([
      Result.countDocuments({ year: 2026 }),
      Result.countDocuments({ year: 2026, result: 'PASS' }),
      Result.aggregate([
        { $match: { year: 2026 } },
        {
          $group: {
            _id: '$district',
            total: { $sum: 1 },
            passed: { $sum: { $cond: [{ $eq: ['$result', 'PASS'] }, 1, 0] } },
            avgMarks: { $avg: '$totalMarks' },
          }
        },
        { $sort: { total: -1 } },
      ]),
      Result.aggregate([
        { $match: { year: 2026 } },
        { $group: { _id: null, totalAPlus: { $sum: '$aPlusCount' } } },
      ]),
    ]);

    const stats = {
      total,
      passed,
      failed: total - passed,
      passPercentage: total > 0 ? Math.round((passed / total) * 100 * 10) / 10 : 0,
      totalAPlus: aPlusData[0]?.totalAPlus || 0,
      districtStats,
      year: 2026,
      lastUpdated: new Date(),
    };

    await setCache(cacheKey, stats, 1800); // 30 min cache
    return stats;
  } catch (err) {
    logger.error('Statistics fetch error:', err);
    // Return demo stats
    return {
      total: 425000,
      passed: 382500,
      failed: 42500,
      passPercentage: 90.0,
      totalAPlus: 125000,
      year: 2026,
      lastUpdated: new Date(),
      districtStats: [],
    };
  }
};

const logAnalytics = async (type, data) => {
  try {
    await Analytics.create({ type, ...data });
  } catch (err) {
    // Non-critical, ignore
  }
};

module.exports = {
  getIndividualResult,
  getSchoolResults,
  getStatistics,
  calculateGrade,
};
