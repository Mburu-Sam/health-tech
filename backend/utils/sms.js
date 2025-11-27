// backend/utils/sms.js
// placeholder SMS integration
async function sendSMS({ to, message }) {
    // implement real provider e.g. Africa's Talking, Twilio
    console.log('sms to', to, message);
  }
  
  module.exports = { sendSMS };
  