import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../utils/errors';
import { createRequestLogger } from '../utils/logger';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    const requestLogger = createRequestLogger(req.requestId);
    requestLogger.error('Error occurred:', {
        error: err,
        path: req.path,
        method: req.method,
        requestId: req.requestId,
    });

    if (err instanceof AppError) {
        const errorData = err.name === 'ValidationError' && 'errors' in err 
            ? (err as unknown as { errors: unknown }).errors 
            : undefined;
        return ApiResponse.error(res, err.message, err.statusCode, errorData);
    }

    if (err instanceof Error) {
        const errorObj = err as Error & { name?: string; errors?: unknown };

        if (errorObj.name === 'ZodError') {
            return ApiResponse.error(res, 'Validation Error', 400, errorObj.errors);
        }

        if (errorObj.name === 'PrismaClientKnownRequestError') {
            return ApiResponse.error(res, 'Database Error', 400);
        }

        if (errorObj.name === 'JsonWebTokenError' || errorObj.name === 'TokenExpiredError') {
            return ApiResponse.error(res, 'Invalid or expired token', 401);
        }

        return ApiResponse.error(res, err.message || 'Internal Server Error', 500);
    }

    return ApiResponse.error(res, 'Unknown Error', 500);
};
