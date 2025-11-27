// backend/routes/patient.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.post('/register', patientController.registerPatient);
router.use(auth);
router.get('/me', patientController.me);
router.post('/book', patientController.bookAppointment);
router.get('/invoices', patientController.listInvoices);
router.get('/invoices/:id/pdf', patientController.downloadInvoice);

module.exports = router;
