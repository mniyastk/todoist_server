// src/controllers/projectController.ts
import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { NotFoundError, UnauthorizedError } from '../utils/customErrors';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user.userId;
  const { name, color } = req.body;

  const project = new Project({
    name,
    color,
    owner: userId,
    collaborators: [userId],
  });

  await project.save();
  res.status(201).json(project);
};

export const getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user.userId;

  const projects = await Project.find({
    $or: [
      { owner: userId },
      { collaborators: userId },
    ],
  })
    .populate('owner', 'username email')
    .populate('collaborators', 'username email');

  res.status(200).json(projects);
};

export const getProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;

  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId },
      { collaborators: userId },
    ],
  })
    .populate('owner', 'username email')
    .populate('collaborators', 'username email');

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  const tasks = await Task.find({ project: projectId })
    .populate('assignee', 'username email')
    .populate('labels');

  res.status(200).json({ project, tasks });
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;
  const { name, color, collaborators } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { name, color, collaborators },
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new UnauthorizedError('Project not found or unauthorized');
  }

  res.status(200).json(project);
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  // @ts-ignore
  const userId = req.user.userId;

  const project = await Project.findOneAndDelete({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new UnauthorizedError('Project not found or unauthorized');
  }

  await Task.deleteMany({ project: projectId });

  res.status(200).json({
    message: 'Project deleted successfully',
    projectId,
  });
};
