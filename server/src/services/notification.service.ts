import { prisma } from '../config/db';
import { NotificationType, Prisma } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { cache, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

interface NotificationQuery {
    page?: string;
    limit?: string;
    isRead?: string;
    type?: string;
}

export const getNotifications = async (userId: string, query: NotificationQuery) => {
    const queryString = JSON.stringify(query);
    const cacheKey = CACHE_KEYS.NOTIFICATION_LIST(userId, queryString);
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached as Awaited<ReturnType<typeof getNotifications>>;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    if (query.isRead !== undefined && query.isRead !== 'ALL') {
        where.isRead = query.isRead === 'true';
    }

    if (query.type && query.type !== 'ALL') {
        where.type = query.type as NotificationType;
    }

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { task: { select: { id: true, title: true } } },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    const result = {
        notifications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        unreadCount,
    };

    cache.set(cacheKey, result, CACHE_TTL.SHORT);
    return result;
};

export const markAsRead = async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
        throw new ForbiddenError('You do not have access to this notification');
    }

    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });

    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`notification:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return updated;
};

export const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });

    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`notification:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return result;
};

export const deleteNotification = async (userId: string, notificationId: string) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
    });

    if (!notification) {
        throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
        throw new ForbiddenError('You do not have access to this notification');
    }

    const deleted = await prisma.notification.delete({
        where: { id: notificationId },
    });

    const cacheKeys = Array.from(cache.getStats().keys).filter(key => 
        key.startsWith(`notification:list:${userId}:`)
    );
    cacheKeys.forEach(key => cache.delete(key));

    return deleted;
};

export const createSystemNotification = async (userId: string, type: NotificationType, message: string, relatedTaskId?: string) => {
    return prisma.notification.create({
        data: {
            userId,
            type,
            message,
            relatedTaskId,
        },
    });
};