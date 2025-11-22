import mongoose from 'mongoose';
import logger from './logger.js';


const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB Connected successfully....');
  } catch (error: any) {
    logger.error('MongoDB connection failed', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};


export default connectDB; 