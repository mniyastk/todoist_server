import express from 'express';
import { register, login, getProfile, updateProfile, refreshToken } from '../controllers/userControllers';

export const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', getProfile);
userRouter.put('/profile', updateProfile);
userRouter.post('/refresh', refreshToken);