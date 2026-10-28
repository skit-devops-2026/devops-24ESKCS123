const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    inputText: { type: String, required: true, trim: true, maxlength: 50000 },
    score: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: { type: String, required: true, enum: ['No input', 'Low risk', 'Medium risk', 'High risk'] },
    summary: { type: String, required: true, trim: true },
    flags: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);
