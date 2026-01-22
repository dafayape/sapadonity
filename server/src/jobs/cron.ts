import cron from 'node-cron';
import { checkDeadlines, checkReminders } from './notification.job';
import logger from '../utils/logger';

export const initCronJobs = () => {
    cron.schedule('*/15 * * * *', async () => {
        logger.info('Running scheduled checks...');
        await checkDeadlines();
        await checkReminders();
    });

    logger.info('Cron system initialized');
};