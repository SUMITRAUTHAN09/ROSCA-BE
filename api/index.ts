// api/index.ts
import app from "../app.js";
import connectDB from "../src/utils/db.js";
import config from "../src/config/config.js";
import logger from "../src/utils/logger.js";

// Initialize database connection for serverless environment
let isConnected = false;

const initializeDatabase = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    logger.info('Initializing database connection...');
    await connectDB(config.db.uri);
    isConnected = true;
    logger.info('Database connected successfully');
  } catch (error: any) {
    logger.error('Database connection failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Initialize database connection
initializeDatabase().catch(console.error);

export default app;
