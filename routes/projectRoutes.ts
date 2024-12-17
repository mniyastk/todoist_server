import express from 'express';
import { createProject, getUserProjects, getProjectDetails, updateProject, deleteProject } from '../controllers/projectController';

export const projectRouter = express.Router();

projectRouter.post('/', createProject);
projectRouter.get('/', getUserProjects);
projectRouter.get('/:projectId', getProjectDetails);
projectRouter.put('/:projectId', updateProject);
projectRouter.delete('/:projectId', deleteProject);