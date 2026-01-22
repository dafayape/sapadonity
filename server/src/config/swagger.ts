import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { env } from './env';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sapadonity API',
            version: '1.0.0',
            description: 'Enterprise To-Do List API Documentation',
        },
        servers: [
            {
                url: env.NODE_ENV === 'production'
                    ? `https://api.sapadonity.com/api`
                    : `http://localhost:${env.PORT}/api`,
                description: env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
            },
        ],
        tags: [
            { name: 'Auth', description: 'Authentication and authorization endpoints' },
            { name: 'Users', description: 'User profile management endpoints' },
            { name: 'Tasks', description: 'Task management endpoints' },
            { name: 'Notifications', description: 'Notification management endpoints' },
            { name: 'Upload', description: 'File upload endpoints' },
            { name: 'Stats', description: 'Dashboard statistics endpoints (Admin only)' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from login endpoint',
                },
            },
            schemas: {
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful',
                        },
                        data: {
                            type: 'object',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'object',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Validation Error',
                        },
                        error: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    path: { type: 'array', items: { type: 'string' } },
                                    message: { type: 'string' },
                                },
                            },
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['fullName', 'email', 'password', 'confirmPassword'],
                    properties: {
                        fullName: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 100,
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
                            example: 'Password123',
                            description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                        },
                        confirmPassword: {
                            type: 'string',
                            example: 'Password123',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        password: {
                            type: 'string',
                            example: 'Password123',
                        },
                    },
                },
                RefreshTokenRequest: {
                    type: 'object',
                    required: ['refreshToken'],
                    properties: {
                        refreshToken: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                        accessToken: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        refreshToken: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        fullName: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'ADMIN'],
                            example: 'USER',
                        },
                        avatar: {
                            type: 'string',
                            nullable: true,
                            example: '/uploads/avatars/avatar.png',
                        },
                        notificationMethod: {
                            type: 'string',
                            enum: ['WEB', 'WHATSAPP', 'TELEGRAM'],
                            example: 'WEB',
                        },
                        phoneNumber: {
                            type: 'string',
                            nullable: true,
                            example: '+1234567890',
                        },
                        telegramChatId: {
                            type: 'string',
                            nullable: true,
                        },
                        themeMode: {
                            type: 'string',
                            enum: ['light', 'dark'],
                            example: 'light',
                        },
                        accentColor: {
                            type: 'string',
                            pattern: '^#[0-9A-F]{6}$',
                            example: '#4F46E5',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                UpdateUserProfileRequest: {
                    type: 'object',
                    properties: {
                        fullName: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 100,
                            example: 'John Doe',
                        },
                        themeMode: {
                            type: 'string',
                            enum: ['light', 'dark'],
                            example: 'light',
                        },
                        accentColor: {
                            type: 'string',
                            pattern: '^#[0-9A-F]{6}$',
                            example: '#4F46E5',
                        },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                        },
                        title: {
                            type: 'string',
                            example: 'Complete project documentation',
                        },
                        description: {
                            type: 'string',
                            nullable: true,
                            example: 'Write comprehensive documentation for the API',
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-12-31T23:59:59.000Z',
                        },
                        priority: {
                            type: 'string',
                            enum: ['LOW', 'MEDIUM', 'HIGH'],
                            example: 'MEDIUM',
                        },
                        status: {
                            type: 'string',
                            enum: ['NOT_YET', 'IN_PROGRESS', 'DONE'],
                            example: 'NOT_YET',
                        },
                        color: {
                            type: 'string',
                            pattern: '^#[0-9A-F]{6}$',
                            example: '#4F46E5',
                        },
                        reminder: {
                            type: 'integer',
                            nullable: true,
                            example: 30,
                            description: 'Reminder time in minutes before due date',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        completedAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                        },
                    },
                },
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title', 'dueDate'],
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 200,
                            example: 'Complete project documentation',
                        },
                        description: {
                            type: 'string',
                            example: 'Write comprehensive documentation for the API',
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-12-31T23:59:59.000Z',
                        },
                        priority: {
                            type: 'string',
                            enum: ['LOW', 'MEDIUM', 'HIGH'],
                            default: 'MEDIUM',
                            example: 'MEDIUM',
                        },
                        status: {
                            type: 'string',
                            enum: ['NOT_YET', 'IN_PROGRESS', 'DONE'],
                            default: 'NOT_YET',
                            example: 'NOT_YET',
                        },
                        color: {
                            type: 'string',
                            pattern: '^#[0-9A-F]{6}$',
                            example: '#4F46E5',
                        },
                        reminder: {
                            type: 'integer',
                            example: 30,
                            description: 'Reminder time in minutes before due date',
                        },
                    },
                },
                UpdateTaskRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 200,
                            example: 'Complete project documentation',
                        },
                        description: {
                            type: 'string',
                            example: 'Write comprehensive documentation for the API',
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-12-31T23:59:59.000Z',
                        },
                        priority: {
                            type: 'string',
                            enum: ['LOW', 'MEDIUM', 'HIGH'],
                            example: 'MEDIUM',
                        },
                        status: {
                            type: 'string',
                            enum: ['NOT_YET', 'IN_PROGRESS', 'DONE'],
                            example: 'IN_PROGRESS',
                        },
                        color: {
                            type: 'string',
                            pattern: '^#[0-9A-F]{6}$',
                            example: '#4F46E5',
                        },
                        reminder: {
                            type: 'integer',
                            example: 30,
                        },
                    },
                },
                TaskListResponse: {
                    type: 'object',
                    properties: {
                        tasks: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Task',
                            },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer', example: 1 },
                                limit: { type: 'integer', example: 10 },
                                total: { type: 'integer', example: 50 },
                                totalPages: { type: 'integer', example: 5 },
                            },
                        },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                        },
                        type: {
                            type: 'string',
                            enum: ['TASK_REMINDER', 'DEADLINE_APPROACHING', 'SYSTEM_UPDATE'],
                            example: 'DEADLINE_APPROACHING',
                        },
                        message: {
                            type: 'string',
                            example: 'Task "Complete project" is due in 1 hour',
                        },
                        relatedTaskId: {
                            type: 'string',
                            format: 'uuid',
                            nullable: true,
                        },
                        isRead: {
                            type: 'boolean',
                            example: false,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                NotificationListResponse: {
                    type: 'object',
                    properties: {
                        notifications: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Notification',
                            },
                        },
                        unreadCount: {
                            type: 'integer',
                            example: 5,
                        },
                    },
                },
                UploadRequest: {
                    type: 'object',
                    required: ['file', 'type'],
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'File to upload (image, PDF, or document)',
                        },
                        type: {
                            type: 'string',
                            enum: ['avatar', 'attachment'],
                            example: 'avatar',
                            description: 'Type of upload: avatar for user profile picture, attachment for task files',
                        },
                    },
                },
                UploadResponse: {
                    type: 'object',
                    properties: {
                        url: {
                            type: 'string',
                            example: '/uploads/avatars/1234567890-avatar.png',
                        },
                        filename: {
                            type: 'string',
                            example: '1234567890-avatar.png',
                        },
                        mimeType: {
                            type: 'string',
                            example: 'image/png',
                        },
                    },
                },
                Stats: {
                    type: 'object',
                    properties: {
                        totalUsers: {
                            type: 'integer',
                            example: 150,
                        },
                        totalTasks: {
                            type: 'integer',
                            example: 500,
                        },
                        completedTasks: {
                            type: 'integer',
                            example: 300,
                        },
                        pendingTasks: {
                            type: 'integer',
                            example: 200,
                        },
                        tasksByPriority: {
                            type: 'object',
                            properties: {
                                LOW: { type: 'integer', example: 100 },
                                MEDIUM: { type: 'integer', example: 250 },
                                HIGH: { type: 'integer', example: 150 },
                            },
                        },
                        tasksByStatus: {
                            type: 'object',
                            properties: {
                                NOT_YET: { type: 'integer', example: 200 },
                                IN_PROGRESS: { type: 'integer', example: 100 },
                                DONE: { type: 'integer', example: 200 },
                            },
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication token is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Invalid or expired token',
                                timestamp: '2024-01-01T00:00:00.000Z',
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: 'User does not have permission to access this resource',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Access denied. Admin role required.',
                                timestamp: '2024-01-01T00:00:00.000Z',
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Resource not found',
                                timestamp: '2024-01-01T00:00:00.000Z',
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ValidationError',
                            },
                        },
                    },
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Internal Server Error',
                                timestamp: '2024-01-01T00:00:00.000Z',
                            },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        path.join(process.cwd(), 'server/src/routes/**/*.ts'),
        path.join(process.cwd(), 'server/src/routes/**/*.js'),
    ],
};

export const swaggerSpec = swaggerJsdoc(options);
