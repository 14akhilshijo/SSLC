const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['individual_search', 'school_search', 'api_call', 'page_view'],
    required: true,
  },
  registerNumber: { type: String },
  schoolCode: { type: String },
  district: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  success: { type: Boolean, default: true },
  responseTime: { type: Number }, // ms
  apiSource: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
}, {
  timestamps: false,
  expireAfterSeconds: 30 * 24 * 60 * 60, // Auto-delete after 30 days
});

analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
