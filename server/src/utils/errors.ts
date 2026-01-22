export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation Error', errors?: unknown) {
        super(message, 400);
        this.name = 'ValidationError';
        if (errors) {
            (this as unknown as { errors: unknown }).errors = errors;
        }
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}
