const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pid: { type: String, unique: true, index: true },
  aadhar: String,
  address: String,
  emergencyContact: { name: String, phone: String },
  admitted: { type: Boolean, default: false },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  history: [{ visitDate: Date, notes: String, doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' } }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
