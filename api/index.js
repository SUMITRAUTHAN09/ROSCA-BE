import app from "../dist/app.js";
import config from "../dist/src/config/config.js";
import connectDB from "../dist/src/utils/db.js";

let dbConnected = false;
let dbPromise = null;

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(200).end();
  }

  // Ensure database is connected before handling request
  if (!dbConnected && !dbPromise) {
    dbPromise = connectDB(config.db.uri)
      .then(() => {
        dbConnected = true;
        console.log("Database connected successfully");
      })
      .catch((err) => {
        console.error("Database connection failed:", err);
        dbPromise = null;
        throw err;
      });
  }

  if (dbPromise && !dbConnected) {
    try {
      await dbPromise;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }
  }

  // Pass request to Express app
  return app(req, res);
}
