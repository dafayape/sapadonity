import { prisma } from '../config/db';
import { NotificationType, TaskStatus } from '@prisma/client';
import { addMinutes, isBefore, isAfter } from 'date-fns';
import logger from '../utils/logger';

export const checkDeadlines = async () => {
    try {
        const now = new Date();
        const next24Hours = addMinutes(now, 1440);

        const tasksDueSoon = await prisma.task.findMany({
            where: {
                dueDate: {
                    gt: now,
                    lte: next24Hours,
                },
                status: {
                    not: TaskStatus.DONE,
                },
                notifications: {
                    none: {
                        type: NotificationType.DEADLINE_APPROACHING,
                    },
                },
            },
        });

        for (const task of tasksDueSoon) {
            await prisma.notification.create({
                data: {
                    userId: task.userId,
                    type: NotificationType.DEADLINE_APPROACHING,
                    message: `Deadline Alert: "${task.title}" is due in less than 24 hours.`,
                    relatedTaskId: task.id,
                },
            });
            logger.info(`Created deadline notification for task: ${task.title}`);
        }
    } catch (error) {
        logger.error('Error checking deadlines:', error);
    }
};

export const checkReminders = async () => {
    try {
        const now = new Date();

        const tasksWithReminders = await prisma.task.findMany({
            where: {
                status: { not: TaskStatus.DONE },
                reminder: { not: null },
            },
            include: {
                notifications: true,
            },
        });

        for (const task of tasksWithReminders) {
            if (!task.reminder) continue;

            const reminderTime = addMinutes(new Date(task.dueDate), -task.reminder);

            const isTimeToSend = isAfter(now, reminderTime) && isBefore(now, task.dueDate);

            const alreadySent = task.notifications.some(
                (n) => n.type === NotificationType.TASK_REMINDER
            );

            if (isTimeToSend && !alreadySent) {
                await prisma.notification.create({
                    data: {
                        userId: task.userId,
                        type: NotificationType.TASK_REMINDER,
                        message: `Reminder: "${task.title}" is due in ${task.reminder} minutes.`,
                        relatedTaskId: task.id,
                    },
                });
                logger.info(`Created reminder notification for task: ${task.title}`);
            }
        }
    } catch (error) {
        logger.error('Error checking reminders:', error);
    }
};