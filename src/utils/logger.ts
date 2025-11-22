import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/config.js';


// Ensure logs folder exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}


// Console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, ...meta }) => {
    let msg = `[${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);


// Create logger
const logger = winston.createLogger({
  level: config.app.env === 'development' ? 'debug' : 'info', // use dev/debug in development
  format: winston.format.json(),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    // All logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});


// Console output in development
if (config.app.env === 'development') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}


export default logger; 