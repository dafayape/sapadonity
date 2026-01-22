import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { ApiResponse } from '../utils/apiResponse';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.createTask(req.user.userId, req.body);
        ApiResponse.success(res, { task }, 'Task created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await taskService.getTasks(req.user.userId, req.query);
        ApiResponse.success(res, result, 'Tasks retrieved successfully');
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const task = await taskService.getTaskById(req.user.userId, taskId);
        ApiResponse.success(res, { task }, 'Task retrieved successfully');
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const task = await taskService.updateTask(req.user.userId, taskId, req.body);
        ApiResponse.success(res, { task }, 'Task updated successfully');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await taskService.deleteTask(req.user.userId, taskId);
        ApiResponse.success(res, null, 'Task deleted successfully');
    } catch (error) {
        next(error);
    }
};