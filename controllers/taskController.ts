import { Request, Response, NextFunction } from 'express';
import { Task, ITask } from '../models/Task';
import { Project } from '../models/Project';
import { 
  NotFoundError, 
  UnauthorizedError, 
  BadRequestError 
} from '../utils/customErrors';

// Utility function to handle async routes
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user.userId;
  const { 
    title, 
    description, 
    project: projectId, 
    priority, 
    dueDate, 
    labels 
  } = req.body;

  // Validate input
  if (!title) {
    throw new BadRequestError('Task title is required');
  }

  // Verify project exists and user has access
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId },
      { collaborators: userId }
    ]
  });

  if (!project) {
    throw new UnauthorizedError('Project not found or unauthorized');
  }

  const task = new Task({
    title,
    description,
    project: projectId,
    creator: userId,
    priority,
    dueDate,
    labels,
    status: 'TODO'
  });

  await task.save();

  // Populate task with project and creator details
  const populatedTask = await Task.findById(task._id)
    .populate('project', 'name color')
    .populate('creator', 'username email')
    .populate('labels');

  res.status(201).json(populatedTask);
});

export const getProjectTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;

  // Verify project access
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId },
      { collaborators: userId }
    ]
  });

  if (!project) {
    throw new UnauthorizedError('Project not found or unauthorized');
  }

  const tasks = await Task.find({ project: projectId })
    .populate('assignee', 'username email')
    .populate('creator', 'username email')
    .populate('labels')
    .sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;

  const { 
    title, 
    description, 
    status, 
    priority, 
    dueDate, 
    labels,
    assignee 
  } = req.body;

  // Find task and verify user's access
  const updatedTask = await Task.findOneAndUpdate(
    { 
      _id: taskId,
      $or: [
        { creator: userId },
        { assignee: userId }
      ]
    },
    { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      labels,
      assignee
    },
    { 
      new: true, 
      runValidators: true 
    }
  );

  if (!updatedTask) {
    throw new NotFoundError('Task not found or unauthorized');
  }

  // Separately populate the updated task
  const populatedTask = await Task.findById(updatedTask._id)
    .populate('project', 'name color')
    .populate('creator', 'username email')
    .populate('assignee', 'username email')
    .populate('labels');

  res.status(200).json(populatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;

  const task = await Task.findOneAndDelete({ 
    _id: taskId,
    $or: [
      { creator: userId },
      { assignee: userId }
    ]
  });

  if (!task) {
    throw new NotFoundError('Task not found or unauthorized');
  }

  res.status(200).json({ message: 'Task deleted successfully' });
});