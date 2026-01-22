import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new UnauthorizedError('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token) as { userId: string; role: string };
        req.user = decoded;
        next();
    } catch {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};
