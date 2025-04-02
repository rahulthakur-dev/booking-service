const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repository');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { PENDING, CANCELLED, INITIATED, BOOKED } = Enums.BOOKING_STATUS;

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

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        let bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        bookingDetails = bookingDetails.dataValues;

        if (bookingDetails.status === CANCELLED) {
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();

        if (currentTime - bookingTime > 300000) { 
            await cancelBooking(data.bookingId); 
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.totalCost !== data.totalCost) {
            throw new AppError('The amount of the payment doesn\'t match', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.userId !== data.userId) {
            throw new AppError('The user corresponding to the booking doesn\'t match', StatusCodes.BAD_REQUEST);
        }

        // We assume here that payment is successful
        const response = await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
        await transaction.commit();
        return response;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);

        if (bookingDetails.status === CANCELLED) {
            await transaction.commit();
            return true;
        }

        const url = `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`;
        await axios.patch(url, {
            seats: bookingDetails.noOfSeats,
            dec: 0,
        });

        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        console.log('Cancelling old bookings');
        const time = new Date(Date.now() - 1000 * 300); // time 5 mins ago
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings,
};
