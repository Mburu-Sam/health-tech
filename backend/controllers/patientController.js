const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

async function registerPatient(req, res) {
  try {
    if (await User.findOne({ email: req.body.email })) return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ ...req.body, role: 'patient' });
    await user.save();
    const patient = new Patient({ user: user._id, pid: `PID${Date.now()}` });
    await patient.save();
    res.json({ message: 'Registered, pending approval' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function me(req, res) {
  const patient = await Patient.findOne({ user: req.user._id }).populate('assignedDoctor');
  res.json(patient);
}

async function bookAppointment(req, res) {
  const { doctorId, datetime, notes } = req.body;
  const patient = await Patient.findOne({ user: req.user._id });
  const appt = new Appointment({ patient: patient._id, doctor: doctorId, datetime, notes, createdBy: req.user._id });
  await appt.save();
  req.app.get('io').to(String(doctorId)).emit('newAppointment', appt);
  res.json(appt);
}

async function listInvoices(req, res) {
  const patient = await Patient.findOne({ user: req.user._id });
  const invoices = await Invoice.find({ patient: patient._id });
  res.json(invoices);
}

async function appointments(req, res) {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
  const list = await Appointment.find({ patient: patient._id })
    .populate('doctor')
    .sort({ datetime: 1 })
    .limit(100);
  res.json(list);
}

async function downloadInvoice(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  const patient = await Patient.findById(invoice.patient).populate('user');
  if (!patient) return res.status(403).json({ message: 'Forbidden' });
  generateInvoicePDF(invoice, patient, res);
}

module.exports = { registerPatient, me, bookAppointment, listInvoices, appointments, downloadInvoice };
