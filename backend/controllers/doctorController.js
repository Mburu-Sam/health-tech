// backend/controllers/doctorController.js
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');

async function apply(req, res) {
  try {
    if (await Doctor.findOne({ user: req.body.user })) {
      return res.status(400).json({ message: 'Already applied' });
    }
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Applied' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function myPatients(req, res) {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const patients = await Patient.find({ assignedDoctor: doctor._id }).populate('user').limit(100);
  res.json(patients);
}

async function appointments(req, res) {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const appts = await Appointment.find({ doctor: doctor._id }).populate('patient').limit(100);
  res.json(appts);
}

async function attendAppointment(req, res) {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  appt.status = 'attended';
  await appt.save();
  res.json({ message: 'Marked attended' });
}

async function createPrescription(req, res) {
  const pres = new Prescription(req.body);
  await pres.save();
  res.json(pres);
}

module.exports = { apply, myPatients, appointments, attendAppointment, createPrescription };
