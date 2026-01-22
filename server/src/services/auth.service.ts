import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UserRole } from '@prisma/client';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { JWT_CONSTANTS } from '../constants/jwt';

const cleanupExpiredTokens = async (userId: string) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId,
            expiresAt: {
                lt: new Date(),
            },
        },
    });
};

export const registerUser = async (data: { fullName: string; email: string; password: string }) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError('Email already exists');

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: UserRole.USER,
        },
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

    await cleanupExpiredTokens(user.id);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS),
        },
    });

    return { user, accessToken, refreshToken };
};

export const loginUser = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    await cleanupExpiredTokens(user.id);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS),
        },
    });

    return {
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            themeMode: user.themeMode,
            createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshAccessToken = async (refreshToken: string) => {
    let decoded: { userId: string };
    try {
        decoded = verifyRefreshToken(refreshToken) as { userId: string };
    } catch {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!tokenRecord) throw new UnauthorizedError('Invalid refresh token');

    if (tokenRecord.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { token: refreshToken } });
        throw new UnauthorizedError('Refresh token expired');
    }

    if (tokenRecord.userId !== decoded.userId) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(tokenRecord.user.id, tokenRecord.user.role);

    return {
        accessToken: newAccessToken,
        user: {
            id: tokenRecord.user.id,
            fullName: tokenRecord.user.fullName,
            email: tokenRecord.user.email,
            role: tokenRecord.user.role,
            avatar: tokenRecord.user.avatar,
            themeMode: tokenRecord.user.themeMode,
            createdAt: tokenRecord.user.createdAt,
        },
    };
};
