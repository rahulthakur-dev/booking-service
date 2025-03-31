const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label } = format;

const customFormat = format.json(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
})

const logger = createLogger({
    level: 'info',
    defaultMeta: { label: 'API' , service: 'base-service' },
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        customFormat,
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: require('path').join(__dirname, '../../logs/error.log'), level: 'error' }),
        new transports.File({ filename: require('path').join(__dirname, '../../logs/combined.log') }),
    ],
});

module.exports = logger;