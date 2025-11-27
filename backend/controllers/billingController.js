// backend/controllers/billingController.js
const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');

async function createInvoice(req, res) {
  const { patientId, items, doctorCharge, roomCharge, otherCharge } = req.body;
  const total = (items || []).reduce((s, it) => s + (it.amount || 0) * (it.qty || 1), 0) + (doctorCharge || 0) + (roomCharge || 0) + (otherCharge || 0);
  const invoice = new Invoice({ patient: patientId, items, doctorCharge, roomCharge, otherCharge, total, generatedBy: req.user._id });
  await invoice.save();
  res.json(invoice);
}

async function payInvoice(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  const { method, transactionId, amount } = req.body;
  invoice.paid = true;
  invoice.paymentDetails = { method, date: new Date(), transactionId, amount };
  await invoice.save();
  res.json({ message: 'Paid', invoice });
}

module.exports = { createInvoice, payInvoice };
