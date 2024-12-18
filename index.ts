import express, { Express, Request, Response, NextFunction } from 'express';
import { connectDatabase } from './config/database';
import { authenticateUser } from './middlewares/authMiddlware';
import { corsConfig, securityMiddleware } from './middlewares/securityMiddleware';
import { requestLogger } from './middlewares/LogginMiddleware';
import { apiLimiter } from './middlewares/rateLimitMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';
import { userRouter } from './routes/userRoutes';
import { projectRouter } from './routes/projectRoutes';
import { taskRouter } from './routes/taskRoutes';

const app: Express = express();
const PORT = process.env.PORT ||5000

connectDatabase();

app.use(corsConfig);
app.use(securityMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(apiLimiter);


app.use('/api/users', userRouter);
app.use('/api/projects', authenticateUser, projectRouter);
app.use('/api/tasks', authenticateUser, taskRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(errorHandler);