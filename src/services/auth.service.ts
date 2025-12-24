import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models';
import { AppError } from '../utils/AppError';

const signToken = (id: number) => {
  return jwt.sign({ id }, (process.env.JWT_SECRET || 'secret') as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'],
  });
};

export const signup = async (data: any) => {
  const existingUser = await models.User.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser = await models.User.create({
    name: data.name,
    email: data.email,
    password_hash: hashedPassword,
    role: data.role || 'USER',
  });

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

export const login = async (data: any) => {
  const user = await models.User.findOne({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user.id);

  return { user, token };
};
