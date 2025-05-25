import dotevn from 'dotenv';

dotevn.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoDbUri?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoDbUri: process.env.MONGO_URI,
}

export default config;