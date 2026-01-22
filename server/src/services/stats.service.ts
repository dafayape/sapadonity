import { prisma } from '../config/db';
import { TaskStatus } from '@prisma/client';
import { subDays, format } from 'date-fns';
import { cache, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

export const getDashboardStats = async () => {
    const cacheKey = CACHE_KEYS.DASHBOARD_STATS;
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached as Awaited<ReturnType<typeof getDashboardStats>>;
    }
    const [totalUsers, totalTasks, activeTasks, completedTasks] = await Promise.all([
        prisma.user.count(),
        prisma.task.count(),
        prisma.task.count({ where: { status: { not: TaskStatus.DONE } } }),
        prisma.task.count({ where: { status: TaskStatus.DONE } }),
    ]);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), i);
        return format(d, 'yyyy-MM-dd');
    }).reverse();

    const taskGraph = await Promise.all(
        last7Days.map(async (date) => {
            const count = await prisma.task.count({
                where: {
                    createdAt: {
                        gte: new Date(`${date}T00:00:00.000Z`),
                        lte: new Date(`${date}T23:59:59.999Z`),
                    },
                },
            });
            return { date, count };
        })
    );

    const result = {
        overview: {
            totalUsers,
            totalTasks,
            activeTasks,
            completedTasks,
        },
        taskGrowth: taskGraph,
    };

    cache.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
};