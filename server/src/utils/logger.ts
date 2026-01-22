import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'sapadonity-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export const createRequestLogger = (requestId?: string) => {
    return {
        info: (message: string, meta?: Record<string, unknown>) => {
            logger.info(message, { requestId, ...meta });
        },
        error: (message: string, meta?: Record<string, unknown>) => {
            logger.error(message, { requestId, ...meta });
        },
        warn: (message: string, meta?: Record<string, unknown>) => {
            logger.warn(message, { requestId, ...meta });
        },
        debug: (message: string, meta?: Record<string, unknown>) => {
            logger.debug(message, { requestId, ...meta });
        },
    };
};

export default logger;
