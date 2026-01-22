import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ValidationError } from '../utils/errors';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) throw new ValidationError('No file uploaded');

        const type = req.body.type === 'avatar' ? 'avatars' : 'attachments';
        const filename = req.file.filename;

        const url = `/uploads/${type}/${filename}`;

        const data = {
            url,
            filename: req.file.originalname,
            filesize: req.file.size,
            mimeType: req.file.mimetype,
        };

        ApiResponse.success(res, data, 'File uploaded successfully', 201);
    } catch (error) {
        next(error);
    }
};