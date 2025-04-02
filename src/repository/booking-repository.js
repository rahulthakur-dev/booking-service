

const { Booking } = require('../models');
const CrudRespository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');


class BookingRepository extends CrudRespository {
    constructor() {
        super(Booking);
    }


    async createBooking(data, transaction) {
        const booking = await Booking.create(data, { transaction });
        return booking;
    }

    async get(data, transaction) {
        const response = await this.model.findByPk(data, { transaction });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction) {
        const response = await this.model.update(data, {
            where: {
                id: id
            },
            transaction: transaction
        });
        return response;
    }
}


module.exports = BookingRepository;