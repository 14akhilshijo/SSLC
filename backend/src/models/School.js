const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolCode: { type: String, required: true, unique: true, index: true },
  schoolName: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String },
  address: { type: String },
  type: {
    type: String,
    enum: ['Government', 'Aided', 'Unaided', 'CBSE', 'ICSE'],
    default: 'Government',
  },
  year: { type: Number, default: 2026 },
  stats: {
    totalStudents: { type: Number, default: 0 },
    passed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    passPercentage: { type: Number, default: 0 },
    totalAPlus: { type: Number, default: 0 },
    toppers: [{
      registerNumber: String,
      studentName: String,
      totalMarks: Number,
      percentage: Number,
      grade: String,
    }],
  },
}, {
  timestamps: true,
});

const School = mongoose.model('School', schoolSchema);
module.exports = School;
