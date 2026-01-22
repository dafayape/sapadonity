import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { ApiResponse } from '../utils/apiResponse';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await notificationService.getNotifications(req.user.userId, req.query);
        ApiResponse.success(res, result, 'Notifications retrieved');
    } catch (error) {
        next(error);
    }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = await notificationService.markAsRead(req.user.userId, notificationId);
        ApiResponse.success(res, result, 'Notification marked as read');
    } catch (error) {
        next(error);
    }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.userId);
        ApiResponse.success(res, result, 'All notifications marked as read');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await notificationService.deleteNotification(req.user.userId, notificationId);
        ApiResponse.success(res, null, 'Notification deleted');
    } catch (error) {
        next(error);
    }
};