import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@prisma/client';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200),
        description: z.string().optional(),
        dueDate: z.string().datetime(),
        priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
        status: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_YET),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        reminder: z.number().int().optional(),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        description: z.string().optional(),
        dueDate: z.string().datetime().optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        reminder: z.number().int().optional(),
    }),
});