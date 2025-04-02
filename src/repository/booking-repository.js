

const { Booking } = require('../models');
const CrudRespository = require('./crud-repository');

class BookingRepository extends CrudRespository {
    constructor() {
        super(Booking);
    }


    async createBooking(data, transaction) {
        const booking = await Booking.create(data, { transaction });
        return booking;
    }
}


module.exports = BookingRepository;