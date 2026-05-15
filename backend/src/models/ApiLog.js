const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  apiName: { type: String, required: true },
  endpoint: { type: String, required: true },
  status: { type: String, enum: ['success', 'error', 'timeout'], required: true },
  statusCode: { type: Number },
  responseTime: { type: Number },
  errorMessage: { type: String },
  timestamp: { type: Date, default: Date.now },
}, {
  expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
});

apiLogSchema.index({ apiName: 1, timestamp: -1 });

const ApiLog = mongoose.model('ApiLog', apiLogSchema);
module.exports = ApiLog;
