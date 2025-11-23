import app from '../dist/app.js';
import connectDB from '../dist/utils/db.js';
import config from '../dist/config/config.js';

// Connect to database on each serverless function invocation
let dbPromise = null;

export default async function handler(req, res) {
  // Ensure database is connected
  if (!dbPromise) {
    dbPromise = connectDB(config.db.uri);
  }
  
  try {
    await dbPromise;
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
  
  return app(req, res);
}