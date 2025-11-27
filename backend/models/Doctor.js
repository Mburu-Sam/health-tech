// backend/models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: String,
  address: String,
  qualifications: String,
  availability: [{ day: String, from: String, to: String }],
  approved: { type: Boolean, default: false },
  bio: String
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
