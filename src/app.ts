import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';
import userRoutes from './routes/user.route';
import taskStatusRoutes from './routes/task-status.route';
import taskRoutes from './routes/task.route';
import priorityRoutes from './routes/priority.route';
import taskTypeRoutes from './routes/task-type.route';
import aiRoutes from './routes/ai.route';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(bodyParser.json());

connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', workspaceRoutes);
app.use('/api/v1', taskStatusRoutes);
app.use('/api/v1', taskRoutes);
app.use('/api/v1', taskTypeRoutes);
app.use('/api/v1', priorityRoutes)

// AI Routes
app.use('/api/v1', aiRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;