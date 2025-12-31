import models from '../models';
import { getPagination, getPagingData } from '../utils/pagination';
import { AppError } from '../utils/AppError';

export const getAllUsers = async (query: any) => {
  const { page, limit, offset } = getPagination(query);

  const { count, rows } = await models.User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password_hash'] }, // Exclude sensitive data
    order: [['createdAt', 'DESC']],
  });

  const result = getPagingData(rows, count, page, limit);

  return {
    users: result.data,
    metadata: result.metadata,
  };
};

export const getUserById = async (id: number) => {
  const user = await models.User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
