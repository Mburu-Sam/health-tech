// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const adminController = require('../controllers/adminController');

router.use(auth, permit('admin'));

router.get('/doctors', adminController.listDoctors);
router.post('/doctors/:id/approve', adminController.approveDoctor);
router.post('/doctors/:id/reject', adminController.rejectDoctor);
router.post('/patients/:id/admit', adminController.admitPatient);
router.post('/patients/:id/discharge', adminController.dischargePatient);
router.get('/invoices/:id/pdf', adminController.downloadInvoice);
router.get('/appointments', adminController.listAppointments);
router.post('/appointments/:id/approve', adminController.approveAppointment);
router.get('/export/users', adminController.exportUsers);

module.exports = router;
