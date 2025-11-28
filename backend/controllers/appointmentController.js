const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

async function myAppointments(req, res) {
  const patient = await Patient.findOne({ user: req.user._id });
  const appts = await Appointment.find({ patient: patient._id }).populate('doctor');
  res.json(appts);
}

async function cancelAppointment(req, res) {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (String(appt.createdBy) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  appt.status = 'cancelled';
  await appt.save();
  res.json({ message: 'Cancelled' });
}

module.exports = { myAppointments, cancelAppointment };
