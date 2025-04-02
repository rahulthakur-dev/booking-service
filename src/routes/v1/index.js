const router = require('express').Router();
const bookingRoutes = require('./booking');

router.use('/bookings', bookingRoutes);

module.exports = router;