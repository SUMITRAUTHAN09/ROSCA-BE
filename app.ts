import express, { NextFunction, Request, Response } from 'express';
import errorHandler from './src/middleware/errorHandler.js';
import googleAuthRoutes from './src/routes/googleAuthroutes.js';
import roomRoutes from './src/routes/roomRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import HTTP_STATUS_CODE from './src/utils/httpStatusCode.js';
import logger from './src/utils/logger.js';

const app = express();

const sendResponse = (res: Response, statusCode: number, responseObj: object) => {
  res.status(statusCode).json(responseObj);
};

// Environment-based allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
].filter(Boolean) as string[];

// Manual CORS - VERY FIRST MIDDLEWARE
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow any origin
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parsing middleware - BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    ip: req.ip,
  });
  next();
});

// Route mounting
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api', googleAuthRoutes);
app.use('/uploads', express.static('uploads'));

// Root endpoint with API documentation / status
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, HTTP_STATUS_CODE.OK, {
    success: true,
    message: 'Welcome to RoscA Backend API',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: 'POST /api/users/signup',
      login: 'POST /api/users/login',
      forgotPassword: 'POST /api/users/forgot-password',
      getAllRooms: 'GET /api/rooms',
      addRoom: 'POST /api/rooms',
      updateRoom: 'PUT /api/rooms/:id',
      deleteRoom: 'DELETE /api/rooms/:id',
      getRoomById: 'GET /api/rooms/:id',
      getUserProfile: 'GET /api/users/me',
    },
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  sendResponse(res, HTTP_STATUS_CODE.OK, {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler for unknown routes
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  sendResponse(res, HTTP_STATUS_CODE.NOT_FOUND, {
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler - MUST be last
app.use(errorHandler);

export default app;