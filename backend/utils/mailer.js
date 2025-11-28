const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587'),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendMail({ to, subject, html }) {
  await transporter.sendMail({ from: process.env.MAIL_USER, to, subject, html });
}

module.exports = { sendMail };
