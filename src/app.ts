import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.route';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;