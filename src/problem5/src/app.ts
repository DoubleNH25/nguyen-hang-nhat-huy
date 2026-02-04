import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import taskRoutes from './routes/task.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';

const app = express();


app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  }
});
app.use(limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use(requestLogger);


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


app.use('/api/tasks', taskRoutes);


app.use(notFoundHandler);


app.use(errorHandler);

export default app;