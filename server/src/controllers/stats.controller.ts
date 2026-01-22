import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/stats.service';
import { ApiResponse } from '../utils/apiResponse';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await statsService.getDashboardStats();
        ApiResponse.success(res, data, 'Dashboard stats retrieved');
    } catch (error) {
        next(error);
    }
};