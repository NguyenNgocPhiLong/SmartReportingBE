import { Request, Response, NextFunction } from 'express';
import logger from '../utils/loggers.utils'; // Đảm bảo bạn đã định nghĩa và xuất `logger` từ tệp này

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
    // Ghi log lỗi
    logger.error('Error occurred: %s', err.stack);

    // Gửi phản hồi lỗi đến client
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        status: err.status || 500,
    });
};
