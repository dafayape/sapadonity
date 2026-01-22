import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { cache, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

interface UpdateUserProfileData {
    fullName?: string;
    themeMode?: string;
    avatar?: string;
}

export const getUserProfile = async (userId: string) => {
    const cacheKey = CACHE_KEYS.USER_PROFILE(userId);
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached as Awaited<ReturnType<typeof getUserProfile>>;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatar: true,
            themeMode: true,
            createdAt: true,
        },
    });

    if (!user) throw new NotFoundError('User not found');
    
    cache.set(cacheKey, user, CACHE_TTL.MEDIUM);
    return user;
};

export const updateUserProfile = async (userId: string, data: UpdateUserProfileData) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            fullName: data.fullName,
            themeMode: data.themeMode,
            avatar: data.avatar,
        },
        select: {
            id: true,
            fullName: true,
            themeMode: true,
            avatar: true,
        },
    });

    const cacheKey = CACHE_KEYS.USER_PROFILE(userId);
    cache.delete(cacheKey);

    return user;
};
