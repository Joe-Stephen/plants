import models from '../models';
import { AppError } from '../utils/AppError';

export const getAllCategories = async (query: any = {}) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 100;
  const offset = (page - 1) * limit;

  const { count, rows } = await models.Category.findAndCountAll({
    limit,
    offset,
    include: [{ model: models.Category, as: 'children' }],
    distinct: true,
  });

  return {
    categories: rows,
    metadata: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getCategoryById = async (id: number) => {
  const category = await models.Category.findByPk(id, {
    include: [{ model: models.Category, as: 'children' }],
  });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

export const createCategory = async (data: any) => {
  const slug = data.name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const existing = await models.Category.findOne({ where: { slug } });
  if (existing) {
    throw new AppError('Category with this name already exists', 400);
  }
  return await models.Category.create({ ...data, slug });
};

export const updateCategory = async (id: number, data: any) => {
  const category = await models.Category.findByPk(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  if (data.name) {
    data.slug = data.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  return await category.update(data);
};

export const deleteCategory = async (id: number) => {
  const category = await models.Category.findByPk(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  await category.destroy();
};
