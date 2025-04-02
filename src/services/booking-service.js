const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repository');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction(); 
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;

        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = flightData.price * data.noOfSeats;
        console.log('Total Billing Amount:', totalBillingAmount);

        const bookingPayload = {
            ...data,
            totalCost: totalBillingAmount,
        }

        const booking = await bookingRepository.createBooking(bookingPayload, transaction);

        const url = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`;
        await axios.patch(url, {
            dec: 1,
            seats: data.noOfSeats,
        });

        await transaction.commit(); 
        return booking;
        return true;
    } catch (error) {
        await transaction.rollback(); 
        throw error;
    }
}

module.exports = {
    createBooking

};
