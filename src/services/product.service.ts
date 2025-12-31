import models from '../models'; // Import default which is the models object
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';
import { sequelize } from '../models'; // Import named export for transactions
import { deleteImage } from '../config/cloudinary';

export const getAllProducts = async (query: any) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
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
    },
  };
};

export const getProductById = async (id: number) => {
  const product = await models.Product.findByPk(id, {
    include: [
      { model: models.ProductImage, as: 'images' },
      { model: models.Category, as: 'category' },
    ],
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

export const createProduct = async (
  data: any,
  files: Express.Multer.File[],
) => {
  const t = await sequelize.transaction();

  try {
    const slug = data.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    const product = await models.Product.create(
      { ...data, slug },
      { transaction: t },
    );

    if (files && files.length > 0) {
      const images = files.map((file, index) => ({
        productId: product.id,
        url: file.path,
        is_primary: index === 0,
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

export const updateProduct = async (
  id: number,
  data: any,
  files?: Express.Multer.File[],
) => {
  const t = await sequelize.transaction();
  try {
    const product = await models.Product.findByPk(id, { transaction: t });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    await product.update(data, { transaction: t });

    if (files && files.length > 0) {
      const images = files.map((file) => ({
        productId: product.id,
        url: file.path,
        is_primary: false, // New images are not primary by default unless logic changes
      }));
      await models.ProductImage.bulkCreate(images, { transaction: t });
    }

    await t.commit();
    return await getProductById(id);
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  const product = await models.Product.findByPk(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  // Images should cascade delete if FK is set up correctly in DB, which we did.
  await product.destroy();
};

export const deleteProductImage = async (id: number) => {
  const image = await models.ProductImage.findByPk(id);

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  // Extract public ID from URL
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1614022874/plants-ecommerce/sample.jpg
  // Public ID: plants-ecommerce/sample
  try {
    const urlParts = image.url.split('/');
    const fileName = urlParts[urlParts.length - 1]; // sample.jpg
    const folderName = urlParts[urlParts.length - 2]; // plants-ecommerce
    const publicId = `${folderName}/${fileName.split('.')[0]}`;

    await deleteImage(publicId);
  } catch (err) {
    console.error('Failed to extract public ID or delete from cloud', err);
  }

  await image.destroy();
};
