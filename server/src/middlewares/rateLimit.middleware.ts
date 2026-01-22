import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const createRateLimiter = (windowMs: number, max: number, message?: string) => {
    return rateLimit({
        windowMs,
        max,
        message: message || 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        skip: () => env.NODE_ENV === 'test',
    });
};

export const generalRateLimiter = createRateLimiter(
    15 * 60 * 1000,
    100,
    'Too many requests from this IP, please try again later.'
);

export const authRateLimiter = createRateLimiter(
    15 * 60 * 1000,
    5,
    'Too many authentication attempts, please try again after 15 minutes.'
);

export const strictRateLimiter = createRateLimiter(
    60 * 1000,
    10,
    'Too many requests, please try again after a minute.'
);
