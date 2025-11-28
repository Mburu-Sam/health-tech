const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const doctorController = require('../controllers/doctorController');

router.post('/apply', doctorController.apply);
router.use(auth, permit('doctor'));
router.get('/patients', doctorController.myPatients);
router.get('/appointments', doctorController.appointments);
router.post('/appointments/:id/attend', doctorController.attendAppointment);
router.post('/prescription', doctorController.createPrescription);

module.exports = router;
