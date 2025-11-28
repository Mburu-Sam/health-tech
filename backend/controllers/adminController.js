const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const xlsx = require('xlsx');

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
}

async function listUsers(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const role = req.query.role && req.query.role !== 'all' ? req.query.role : undefined;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(query)
    ]);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role, phone, meta, approved } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role, phone, meta, approved });
    await user.save();
    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatableFields = ['name', 'email', 'role', 'phone', 'meta', 'approved'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        await Appointment.deleteMany({ doctor: doctor._id });
        await doctor.deleteOne();
      }
    } else if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: user._id });
      if (patient) {
        await Appointment.deleteMany({ patient: patient._id });
        await patient.deleteOne();
      }
    } else {
      await Appointment.deleteMany({ createdBy: user._id });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

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
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listDoctors,
  approveDoctor,
  rejectDoctor,
  admitPatient,
  dischargePatient,
  downloadInvoice,
  listAppointments,
  approveAppointment,
  exportUsers
};
