import express from 'express';
import { createTask, getProjectTasks, updateTask, deleteTask } from '../controllers/taskController';

export const taskRouter = express.Router();

taskRouter.post('/', createTask);
taskRouter.get('/project/:projectId', getProjectTasks);
taskRouter.put('/:taskId', updateTask);
taskRouter.delete('/:taskId', deleteTask);