const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

// Booking routes
router.post('/', BookingController.createBooking);



// Export the router
module.exports = router;