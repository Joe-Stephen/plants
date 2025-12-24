import models from '../models'; // Import default which is the models object
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';
import { sequelize } from '../models'; // Import named export for transactions

export const getAllProducts = async (query: any) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;

  const where: any = {};
  
  if (query.search) {
    where.name = { [Op.like]: `%${query.search}%` };
  }
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.minPrice) {
    where.price = { ...where.price, [Op.gte]: query.minPrice };
  }
  if (query.maxPrice) {
    where.price = { ...where.price, [Op.lte]: query.maxPrice };
  }

  const { count, rows } = await models.Product.findAndCountAll({
    where,
    limit,
    offset,
    include: [{ model: models.ProductImage, as: 'images' }], // Correct association
    distinct: true,
  });

  return {
    products: rows,
    metadata: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    }
  };
};

export const getProductById = async (id: number) => {
  const product = await models.Product.findByPk(id, {
    include: [
      { model: models.ProductImage, as: 'images' },
      { model: models.Category, as: 'category' }
    ]
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

export const createProduct = async (data: any, files: Express.Multer.File[]) => {
  const t = await sequelize.transaction();

  try {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const product = await models.Product.create({ ...data, slug }, { transaction: t });

    if (files && files.length > 0) {
      const images = files.map((file, index) => ({
        productId: product.id,
        url: file.path, 
        is_primary: index === 0
      }));
      await models.ProductImage.bulkCreate(images, { transaction: t });
    }

    await t.commit();
    return await getProductById(product.id);
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateProduct = async (id: number, data: any) => {
  const product = await models.Product.findByPk(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  if (data.name) {
    data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  return await product.update(data);
};

export const deleteProduct = async (id: number) => {
  const product = await models.Product.findByPk(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  // Images should cascade delete if FK is set up correctly in DB, which we did.
  await product.destroy();
};
