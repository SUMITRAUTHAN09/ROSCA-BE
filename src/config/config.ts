import dotenv from 'dotenv';
dotenv.config(); // Load .env variables

interface AppConfig {
  port: number;
  env: string;
  name: string;
}

interface DBConfig {
  uri: string;
}

interface EmailConfig {
  user: string;
  pass: string;  // Changed from 'password' to 'pass'
  apiKey?: string;  // Optional
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface SecurityConfig {
  bcryptSaltRounds: number;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface LoggingConfig {
  level: string;
  nodeEnv: string;
  appName: string;
}

interface Config {
  app: AppConfig;
  db: DBConfig;
  email: EmailConfig;
  cloudinary: CloudinaryConfig;
  security: SecurityConfig;
  jwt: JWTConfig;
  logging: LoggingConfig;
}

const config: Config = {
  app: {
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'RoscA Backend',
  },
  db: {
    uri: process.env.MONGO_URI || 'mongodb+srv://root:root@cluster0.mx9jy6u.mongodb.net/',
  },
  email: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',  // Maps EMAIL_PASSWORD to 'pass'
    apiKey: process.env.EMAIL_API_KEY,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  security: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'findmyroom',
  },
};

export default config;