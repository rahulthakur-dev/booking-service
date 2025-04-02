const router = require('express').Router();
const bookingRoutes = require('./v1');



router.use('/v1', require('./v1'));


module.exports = router;