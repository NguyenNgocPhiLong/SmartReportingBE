import { createLogger, format, transports } from 'winston';
import path from 'path';

// Tạo logger với các định dạng và transports
const logger = createLogger({
  // Kết hợp các định dạng của log
  format: format.combine(
    format.splat(),
    // Định dạng thời gian cho log
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    // Thiết lập định dạng của log
    format.printf((log) => {
      // Nếu log là error thì hiển thị stack trace, nếu không thì hiển thị message của log
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    // Hiển thị log thông qua console
    new transports.Console(),
    // Thiết lập ghi các lỗi vào file
    new transports.File({
      level: 'error',
      filename: path.join(__dirname, '../../../logs/errors.log')
    })
  ]
});

export default logger;
