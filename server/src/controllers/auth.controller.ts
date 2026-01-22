import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.registerUser(req.body);
        ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.loginUser(req.body);
        ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const { ValidationError } = await import('../utils/errors');
            throw new ValidationError('Refresh token is required');
        }

        const result = await authService.refreshAccessToken(refreshToken);
        ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (error) {
        next(error);
    }
};