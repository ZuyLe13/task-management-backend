import dotevn from 'dotenv';
import jwt from 'jsonwebtoken';

dotevn.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoDbUri?: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoDbUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key',
}

export default config;