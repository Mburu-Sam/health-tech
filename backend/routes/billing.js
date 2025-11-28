const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const billingController = require('../controllers/billingController');

router.use(auth);
router.post('/invoice', permit('admin', 'receptionist'), billingController.createInvoice);
router.post('/pay/:id', billingController.payInvoice);

module.exports = router;
