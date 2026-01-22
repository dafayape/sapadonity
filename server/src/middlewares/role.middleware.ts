import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have access to this resource'));
        }

        next();
    };
};