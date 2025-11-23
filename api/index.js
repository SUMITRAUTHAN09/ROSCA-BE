import app from '../dist/app.js';
import connectDB from '../dist/utils/db.js';
import config from '../dist/config/config.js';

// Connect to database once (reused across invocations)
let dbPromise = null;

const handler = async (req, res) => {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure database is connected
  if (!dbPromise) {
    dbPromise = connectDB(config.db.uri).catch(err => {
      console.error('Database connection failed:', err);
      dbPromise = null; // Reset on failure
      throw err;
    });
  }
  
  try {
    await dbPromise;
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Database connection failed' 
    });
  }
  
  // Pass to Express app
  return app(req, res);
};

export default handler;