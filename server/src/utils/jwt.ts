import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWT_CONSTANTS } from '../constants/jwt';

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};