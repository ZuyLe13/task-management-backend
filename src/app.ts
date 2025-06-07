import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', workspaceRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;