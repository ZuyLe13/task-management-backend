import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';
import userRoutes from './routes/user.route';
import taskStatusRoutes from './routes/task-status.route';
import taskRoutes from './routes/task.route';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', workspaceRoutes);
app.use('/api/v1', taskStatusRoutes);
app.use('/api/v1', taskRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;