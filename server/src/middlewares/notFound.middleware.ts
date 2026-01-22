import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response) => {
    ApiResponse.error(res, `Route ${req.method} ${req.path} not found`, 404);
};
