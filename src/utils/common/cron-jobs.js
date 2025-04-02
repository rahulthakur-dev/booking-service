const cron = require('node-cron');
const { BookingService } = require('../../services');

function scheduleCrons() {
    cron.schedule('*/1 * * * *', async () => {
        console.log("Starting cron again");
        try {
            const response = await BookingService.cancelOldBookings();
            console.log(response);
        } catch (error) {
            console.error("Error in cron job:", error);
        }
    });
}

module.exports = scheduleCrons;