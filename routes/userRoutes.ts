import express from 'express';
import { register, login, getProfile, updateProfile, refreshToken } from '../controllers/userControllers';
import { authenticateUser } from '../middlewares/authMiddlware';

export const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile',authenticateUser, getProfile);
userRouter.put('/profile',authenticateUser, updateProfile);
userRouter.post('/refresh', refreshToken);