/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: File upload endpoints
 */

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload file (Avatar or Attachment)
 *     description: |
 *       Upload a file for user avatar or task attachment.
 *       Supported formats: images (PNG, JPG, JPEG, GIF, WEBP), PDF, and documents (DOC, DOCX, XLS, XLSX).
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadRequest'
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Invalid file type or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       413:
 *         description: File too large (max 10MB)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { upload, handleUploadError } from '../middlewares/upload.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post(
    '/',
    authenticate,
    upload.single('file'),
    handleUploadError,
    uploadController.uploadFile
);

export default router;