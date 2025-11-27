const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');
const { sendSMS } = require('../utils/sms');

cron.schedule('*/30 * * * *', async () => {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  const appts = await Appointment.find({ datetime: { $gte: now, $lte: nextHour }, status: 'confirmed' }).populate('patient');
  for (const a of appts) {
    const pat = await Patient.findById(a.patient).populate('user');
    if (pat && pat.user) {
      sendMail({ to: pat.user.email, subject: 'Appointment reminder', html: `Reminder for appointment at ${a.datetime}` }).catch(console.error);
      sendSMS({ to: pat.user.phone, message: `Appointment at ${a.datetime}` }).catch(console.error);
    }
  }
});
