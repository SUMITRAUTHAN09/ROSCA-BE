import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import roomRoutes from './src/routes/roomRoutes.js'; // room routes with multer
import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/utils/logger.js';
import HTTP_STATUS_CODE from './src/utils/httpStatusCode.js';

// Initialize app
const app = express();

// Utility for consistent JSON responses
const sendResponse = (res: Response, statusCode: number, responseObj: object) => {
  res.status(statusCode).json(responseObj);
};

// Middleware
app.use(cors());

// Apply JSON and urlencoded body parsing ONLY to user-related routes (no file upload here)
app.use('/api/users', express.json(), express.urlencoded({ extended: true }), userRoutes);

// For room routes (with file upload), DO NOT apply global json/urlencoded parser here
app.use('/api/rooms', roomRoutes); // multer handles multipart/form-data inside roomRoutes

// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Root welcome route
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, HTTP_STATUS_CODE.OK, {
    success: true,
    message: 'Welcome to RoscA Backend API',
    endpoints: {
      signup: 'POST /api/users/signup',
      login: 'POST /api/users/login',
      forgotPassword: 'POST /api/users/forgot-password',
      getAllRooms: 'GET /api/rooms',
      addRoom: 'POST /api/rooms',
      updateRoom: 'PUT /api/rooms/:id',
      deleteRoom: 'DELETE /api/rooms/:id',
      getRoomById: 'GET /api/rooms/:id',
    },
  });
});

// 404 handler middleware
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  sendResponse(res, HTTP_STATUS_CODE.NOT_FOUND, {
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export default app;
