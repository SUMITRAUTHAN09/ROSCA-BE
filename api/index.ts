// api/index.ts
import { Request, Response } from 'express';
import app from "../app.js";
import connectDB from "../src/utils/db.js";
import config from "../src/config/config.js";
import logger from "../src/utils/logger.js";

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

const initializeDatabase = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  // Start new connection
  connectionPromise = (async () => {
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
      connectionPromise = null; // Reset so it can retry
      throw error;
    }
  })();

  await connectionPromise;
};

// Export handler that ensures DB is connected before processing request
export default async (req: Request, res: Response) => {
  try {
    // Wait for database connection before handling request
    await initializeDatabase();
    
    // Pass request to Express app
    return app(req, res);
  } catch (error: any) {
    logger.error('Handler error', { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};