const { StatusCodes } = require('../utils/status-codes');

const { Booking } = require('../models');
const CrudRespository = require('./crud-repository');

class BookingRepository extends CrudRespository {
    constructor() {
        super(Booking);
    }
}


module.exports = BookingRepository;