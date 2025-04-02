const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

// Booking routes
router.post('/', BookingController.createBooking);

router.post('/payments', BookingController.makePayment);



// Export the router
module.exports = router;