import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import taskRoutes from './task.routes';
import notificationRoutes from './notification.routes';
import uploadRoutes from './upload.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/stats', statsRoutes);

export default router;