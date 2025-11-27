// backend/models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  items: [{ description: String, amount: Number, qty: Number }],
  doctorCharge: { type: Number, default: 0 },
  roomCharge: { type: Number, default: 0 },
  otherCharge: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paid: { type: Boolean, default: false },
  paymentDetails: { method: String, date: Date, transactionId: String }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
