import { Request, Response, NextFunction } from 'express';
import logger from '../utils/loggers.utils'; // Đảm bảo bạn đã định nghĩa và xuất `logger` từ tệp này

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Ghi log khi tài nguyên không tìm thấy
    logger.warn(`404 Not Found - ${req.method} ${req.originalUrl}`);

    // Gửi phản hồi lỗi 404
    res.status(404).json({
        message: 'Resource not found',
        status: 404,
    });
};
