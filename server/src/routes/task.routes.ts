/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *           examples:
 *             example1:
 *               value:
 *                 title: 'Complete project documentation'
 *                 description: 'Write comprehensive documentation for the API'
 *                 dueDate: '2024-12-31T23:59:59.000Z'
 *                 priority: 'HIGH'
 *                 status: 'NOT_YET'
 *                 color: '#4F46E5'
 *                 reminder: 30
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         task:
 *                           $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   get:
 *     summary: Get all tasks with filters
 *     description: Retrieve all tasks for the authenticated user with optional filtering and pagination
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ALL, NOT_YET, IN_PROGRESS, DONE]
 *           default: ALL
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [ALL, LOW, MEDIUM, HIGH]
 *           default: ALL
 *         description: Filter tasks by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title or description
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TaskListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task details
 *     description: Retrieve detailed information about a specific task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Task details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         task:
 *                           $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   patch:
 *     summary: Update task
 *     description: Update an existing task. Only the task owner can update their tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *           examples:
 *             example1:
 *               value:
 *                 title: 'Updated task title'
 *                 status: 'IN_PROGRESS'
 *                 priority: 'HIGH'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         task:
 *                           $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: You don't have permission to update this task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete task
 *     description: Delete a task. Only the task owner can delete their tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *         example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: You don't have permission to delete this task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getOne);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.remove);

export default router;