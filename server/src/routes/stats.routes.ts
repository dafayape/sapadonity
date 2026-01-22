/**
 * @swagger
 * tags:
 *   - name: Stats
 *     description: Dashboard statistics endpoints (Admin only)
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve dashboard statistics including user counts, task statistics, and analytics. This endpoint is only accessible to users with ADMIN role.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Stats'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), statsController.getStats);

export default router;