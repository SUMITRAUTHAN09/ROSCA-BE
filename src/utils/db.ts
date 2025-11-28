import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (uri: string): Promise<void> => {
  try {
    // Configure for serverless
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 30000);

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    await mongoose.connect(uri, options);
    
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error('MongoDB connection error:', {
      message: error.message,
      code: error.code
    });
    throw error;
  }
};

export default connectDB;