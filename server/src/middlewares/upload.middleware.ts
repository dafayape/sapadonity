import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        const type = req.body.type === 'avatar' ? 'avatars' : 'attachments';
        const uploadPath = path.join(process.cwd(), 'public/uploads', type);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FilenameCallback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and docs are allowed.'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export const handleUploadError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return ApiResponse.error(res, 'File too large. Max 10MB.', 400);
        }
        return ApiResponse.error(res, err.message, 400);
    }
    if (err instanceof Error) {
        return ApiResponse.error(res, err.message, 400);
    }
    next();
};