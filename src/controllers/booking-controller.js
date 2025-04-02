const { BookingService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');



async function createBooking(req,res){
    try{
        const { flightId, userId,noOfSeats  } = req.body;
        const booking = await BookingService.createBooking({ 
            flightId,
            userId,
            noOfSeats
        });
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}
module.exports = {
    createBooking,
    makePayment
};
