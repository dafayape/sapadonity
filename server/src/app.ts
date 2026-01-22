import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { requestIdMiddleware } from './middlewares/requestId.middleware';
import { generalRateLimiter } from './middlewares/rateLimit.middleware';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));

const corsOptions = {
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
};

app.use(cors(corsOptions));

app.use(requestIdMiddleware);
app.use(generalRateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sapadonity API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
    },
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        requestId: req.requestId,
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;