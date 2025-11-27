const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const xlsx = require('xlsx');

async function listDoctors(req, res) {
  const doctors = await Doctor.find().populate('user');
  res.json(doctors);
}

async function approveDoctor(req, res) {
  const doc = await Doctor.findById(req.params.id).populate('user');
  if (!doc) return res.status(404).json({ message: 'Not found' });
  doc.approved = true;
  doc.user.approved = true;
  await doc.user.save();
  await doc.save();
  res.json({ message: 'Approved' });
}

async function rejectDoctor(req, res) {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rejected' });
}

async function admitPatient(req, res) {
  const patient = await Patient.findById(req.params.id).populate('user');
  if (!patient) return res.status(404).json({ message: 'Not found' });
  patient.admitted = true;
  await patient.save();
  res.json({ message: 'Admitted' });
}

async function dischargePatient(req, res) {
  const patient = await Patient.findById(req.params.id).populate('user');
  if (!patient) return res.status(404).json({ message: 'Not found' });
  patient.admitted = false;
  await patient.save();
  // generate invoice if exists
  const invoice = await Invoice.findOne({ patient: patient._id });
  if (invoice) {
    req.app.get('io').to(String(patient._id)).emit('discharged', { patientId: patient._id });
  }
  res.json({ message: 'Discharged' });
}

async function downloadInvoice(req, res) {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  const patient = await Patient.findById(invoice.patient).populate('user');
  generateInvoicePDF(invoice, patient, res);
}

async function listAppointments(req, res) {
  const appointments = await Appointment.find().populate('patient doctor');
  res.json(appointments);
}

async function approveAppointment(req, res) {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  appt.status = 'confirmed';
  await appt.save();
  req.app.get('io').to(String(appt.patient)).emit('appointmentConfirmed', appt);
  res.json({ message: 'Approved' });
}

async function exportUsers(req, res) {
  const users = await User.find().lean();
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(users);
  xlsx.utils.book_append_sheet(wb, ws, 'users');
  const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
}

module.exports = {
  listDoctors, approveDoctor, rejectDoctor, admitPatient, dischargePatient, downloadInvoice, listAppointments, approveAppointment, exportUsers
};
