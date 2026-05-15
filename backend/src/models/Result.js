const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  theory: { type: Number, default: 0 },
  practical: { type: Number, default: 0 },
  total: { type: Number, required: true },
  grade: { type: String, required: true },
  isAPlus: { type: Boolean, default: false },
}, { _id: false });

const resultSchema = new mongoose.Schema({
  registerNumber: {
    type: String,
    required: true,
    index: true,
    uppercase: true,
    trim: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  studentName: { type: String, required: true },
  schoolCode: { type: String, required: true, index: true },
  schoolName: { type: String, required: true },
  district: { type: String, required: true },
  subjects: [subjectSchema],
  totalMarks: { type: Number, required: true },
  maxMarks: { type: Number, default: 600 },
  percentage: { type: Number, required: true },
  result: {
    type: String,
    enum: ['PASS', 'FAIL', 'WITHHELD', 'ABSENT'],
    required: true,
  },
  grade: { type: String, required: true },
  aPlusCount: { type: Number, default: 0 },
  rank: { type: Number },
  schoolRank: { type: Number },
  year: { type: Number, default: 2026 },
  qrCode: { type: String },
  fetchedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'api' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Compound index for fast lookups
resultSchema.index({ registerNumber: 1, year: 1 }, { unique: true });
resultSchema.index({ schoolCode: 1, year: 1 });
resultSchema.index({ district: 1, year: 1 });

// Virtual: pass status
resultSchema.virtual('isPassed').get(function () {
  return this.result === 'PASS';
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
