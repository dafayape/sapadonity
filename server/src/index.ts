import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { initCronJobs } from './jobs/cron';
import logger from './utils/logger';

let server: ReturnType<typeof app.listen>;

async function main() {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        initCronJobs();

        server = app.listen(env.PORT, () => {
            logger.info(`Server running on http://localhost:${env.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    if (server) {
        server.close(async () => {
            logger.info('HTTP server closed');

            try {
                await prisma.$disconnect();
                logger.info('Database disconnected');
                process.exit(0);
            } catch (error) {
                logger.error('Error during shutdown:', error);
                process.exit(1);
            }
        });
    } else {
        try {
            await prisma.$disconnect();
            logger.info('Database disconnected');
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

main();