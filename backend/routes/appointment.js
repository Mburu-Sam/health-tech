// backend/routes/appointment.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.use(auth);
router.get('/', appointmentController.myAppointments);
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
