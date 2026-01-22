import { prisma } from '../config/db';
import { TaskStatus, TaskPriority, Prisma } from '@prisma/client';
import { NotFoundError } from '../utils/errors';
import { cache, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

interface CreateTaskData {
    title: string;
    description?: string;
    dueDate: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    color?: string;
    reminder?: number;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    color?: string;
    reminder?: number;
}

interface TaskQuery {
    page?: string;
    limit?: string;
    search?: string;
    priority?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export const createTask = async (userId: string, data: CreateTaskData) => {
    const task = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            dueDate: new Date(data.dueDate),
            priority: data.priority || TaskPriority.MEDIUM,
            status: data.status || TaskStatus.NOT_YET,
            color: data.color,
            reminder: data.reminder,
            userId,
        },
    });

    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`task:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return task;
};

export const getTasks = async (userId: string, query: TaskQuery) => {
    const queryString = JSON.stringify(query);
    const cacheKey = CACHE_KEYS.TASK_LIST(userId, queryString);
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached as Awaited<ReturnType<typeof getTasks>>;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = { userId };

    if (query.search) {
        where.title = { contains: query.search, mode: 'insensitive' };
    }

    if (query.priority && query.priority !== 'ALL') {
        where.priority = query.priority as TaskPriority;
    }

    if (query.status && query.status !== 'ALL') {
        where.status = query.status as TaskStatus;
    }

    if (query.startDate && query.endDate) {
        where.dueDate = {
            gte: new Date(query.startDate),
            lte: new Date(query.endDate),
        };
    }

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: { dueDate: 'asc' },
            include: { attachments: true },
        }),
        prisma.task.count({ where }),
    ]);

    const result = {
        tasks,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };

    cache.set(cacheKey, result, CACHE_TTL.SHORT);
    return result;
};

export const getTaskById = async (userId: string, taskId: string) => {
    const cacheKey = CACHE_KEYS.TASK_DETAIL(userId, taskId);
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached as Awaited<ReturnType<typeof getTaskById>>;
    }

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
        include: { attachments: true },
    });
    if (!task) throw new NotFoundError('Task not found');
    
    cache.set(cacheKey, task, CACHE_TTL.MEDIUM);
    return task;
};

export const updateTask = async (userId: string, taskId: string, data: UpdateTaskData) => {
    const task = await getTaskById(userId, taskId);

    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.reminder !== undefined) updateData.reminder = data.reminder;

    if (data.status !== undefined) {
        updateData.status = data.status;
        if (data.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
            updateData.completedAt = new Date();
        } else if (data.status !== TaskStatus.DONE) {
            updateData.completedAt = null;
        }
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
    });

    const cacheKey = CACHE_KEYS.TASK_DETAIL(userId, taskId);
    cache.delete(cacheKey);
    
    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`task:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return updatedTask;
};

export const deleteTask = async (userId: string, taskId: string) => {
    await getTaskById(userId, taskId);
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });

    const cacheKey = CACHE_KEYS.TASK_DETAIL(userId, taskId);
    cache.delete(cacheKey);
    
    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`task:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return deletedTask;
};