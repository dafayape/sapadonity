import { Response } from 'express';

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message = 'Success',
        statusCode = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static error(
        res: Response,
        message = 'Error',
        statusCode = 500,
        error?: unknown
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            error,
            timestamp: new Date().toISOString(),
        });
    }
}
