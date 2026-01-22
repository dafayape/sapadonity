import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        fullName: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        confirmPassword: z.string().min(8),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});

export const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1),
    }),
});