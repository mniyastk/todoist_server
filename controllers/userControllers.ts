// src/controllers/userController.ts
import { Request, Response } from 'express';
import { IUser, User } from '../models/User';
import {  comparePassword, hashPassword } from '../utils/bcryptHelper';
import { authenticateToken,generateAccessToken,generateRefreshToken,verifyToken, } from '../utils/jwtHelper';
import { userRegistrationSchema, validateInput } from '../utils/validation';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/customErrors';

export const register = async (req: Request, res: Response) => {
  validateInput(req.body, userRegistrationSchema);

  const { username, email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] })
  if (existingUser) {
    throw new ConflictError('User already exists', existingUser.email === email ? 'email' : 'username');
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName
  });
  await user.save();

  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password: _, ...userResponse } = user.toObject();

  res.status(201).json({
    user: userResponse,
    tokens: { access: accessToken, refresh: refreshToken }
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  
  const { password: _, ...userResponse } = user.toObject();

  res.status(200).json({
    user: userResponse,
    tokens: { access: accessToken, refresh: refreshToken }
  });
};

export const getProfile = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.userId;

  const user = await User.findById(userId)
    .select('-password')
    .populate('projects');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.userId;
  const { firstName, lastName, profileImage } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, profileImage },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json(user);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token required');
  }

  const decoded = verifyToken(refreshToken);
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new UnauthorizedError('Invalid token');
  }

  const payload = { userId: user._id.toString(), email: user.email };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  res.status(200).json({
    tokens: { access: newAccessToken, refresh: newRefreshToken }
  });
};
