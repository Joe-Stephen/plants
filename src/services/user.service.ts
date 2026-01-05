import models from '../models';
import { getPagination, getPagingData } from '../utils/pagination';
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';

export const getAllUsers = async (query: any) => {
  const { page, limit, offset } = getPagination(query);
  const where: any = {};

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { email: { [Op.like]: `%${query.search}%` } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.role) {
    where.role = query.role;
  }

  const { count, rows } = await models.User.findAndCountAll({
    where,
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
    include: [
      {
        model: models.Address,
        as: 'addresses',
      },
    ],
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const ordersCount = await models.Order.count({ where: { userId: id } });

  return {
    ...user.toJSON(),
    ordersCount,
  };
};

export const updateUserRole = async (id: number, role: 'USER' | 'ADMIN') => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent self-demotion logic should arguably be in controller or here if we have context of current user
  // For now, we update. Controller will check if needed, or we just rely on ID.
  // Actually, typically we pass the currentUser to service to validate permissions or checks.
  // But strictly, we'll implement the update logic here.

  await user.update({ role });

  // Reload to ensure we return clean object without password if default scope includes it,
  // though we are careful. By default sequelize returns instance.

  return user.reload({ attributes: { exclude: ['password_hash'] } });
};

export const updateUserStatus = async (
  id: number,
  status: 'active' | 'inactive',
) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent blocking self is handled in controller, but good to have fallback checks if context allows.
  // We will proceed with update.

  await user.update({ status });

  return user.reload({ attributes: { exclude: ['password_hash'] } });
};
