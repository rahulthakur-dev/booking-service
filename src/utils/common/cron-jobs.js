const cron = require('node-cron');

function scheduleCrons() {
    cron.schedule('*/5 * * * * *', () => {
        console.log('Running a task every 5 seconds');
    });
}

module.exports = scheduleCrons;