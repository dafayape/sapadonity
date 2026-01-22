import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserProfile(req.user.userId);
        ApiResponse.success(res, { user }, 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateUserProfile(req.user.userId, req.body);
        ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};