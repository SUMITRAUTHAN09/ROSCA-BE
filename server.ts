import app from './app.js';
import config from './src/config/config.js';
import connectDB from './src/utils/db.js';
import logger from './src/utils/logger.js';

logger.info('Starting server...', { env: config.app.env });
logger.debug('Configuration loaded', {
  port: config.app.port,
  dbConfigured: config.db.uri ? 'Yes' : 'No',
  appName: config.app.name
});

const startServer = async (): Promise<void> => {
  try {
    logger.info('Connecting to database...');
    // Connect to MongoDB
    await connectDB(config.db.uri);
    logger.info('Database connected successfully');
    
    // Start server
    app.listen(config.app.port, () => {
      logger.info(`Server is running on port ${config.app.port}`, {
        port: config.app.port,
        env: config.app.env,
        localUrl:` http://localhost:${config.app.port}`
      });
      logger.info(`Local: http://localhost:${config.app.port}`);
    });
  } catch (err: any) {
    logger.error('Error starting server', {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise
  });
  process.exit(1);
});

// Only start server in development (not on Vercel)
if (!process.env.VERCEL) {
  startServer();
} else {
  // In production (Vercel), connect to DB but don't listen
  // Vercel handles the HTTP server
  connectDB(config.db.uri).catch((err) => {
    logger.error('Database connection failed in production', {
      error: err.message,
      stack: err.stack
    });
  });
}

// Export app for Vercel serverless functions
export default app;