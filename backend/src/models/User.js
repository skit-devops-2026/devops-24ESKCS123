const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    goal: {
      type: String,
      required: true,
      enum: ['check_job_offers', 'get_scam_alerts', 'career_support', 'other'],
    },
    updates: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
