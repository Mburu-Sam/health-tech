// backend/models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [{ name: String, dose: String, freq: String, duration: String, notes: String }],
  instructions: String,
  issuedAt: { type: Date, default: Date.now },
  exportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
