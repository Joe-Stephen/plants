"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImage = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const sequelize_1 = require("sequelize");
const models_2 = require("../models");
const cloudinary_1 = require("../config/cloudinary");
const pagination_1 = require("../utils/pagination");
const getAllProducts = async (query) => {
    const { page, limit, offset } = (0, pagination_1.getPagination)(query);
    const where = {};
    if (query.search) {
        where.name = { [sequelize_1.Op.like]: `%${query.search}%` };
    }
    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }
    if (query.minPrice) {
        where.price = { ...where.price, [sequelize_1.Op.gte]: query.minPrice };
    }
    if (query.maxPrice) {
        where.price = { ...where.price, [sequelize_1.Op.lte]: query.maxPrice };
    }
    if (query.sort === 'best_selling') {
        try {
            const topProducts = await models_1.default.Product.findAll({
                attributes: [
                    'id',
                    [
                        models_2.sequelize.literal('COALESCE(SUM(`OrderItems`.`quantity`), 0)'),
                        'totalSold',
                    ],
                ],
                include: [
                    {
                        model: models_1.default.OrderItem,
                        attributes: [],
                    },
                ],
                group: ['Product.id'],
                order: [[models_2.sequelize.literal('totalSold'), 'DESC']],
                limit: limit || 4,
                offset,
                subQuery: false,
            });
            const productIds = topProducts.map((p) => p.id);
            if (productIds.length === 0) {
                return {
                    products: [],
                    metadata: {
                        total: 0,
                        page: 1,
                        limit: limit || 4,
                        totalPages: 0,
                    },
                };
            }
            const products = await models_1.default.Product.findAll({
                where: { id: productIds },
                include: [
                    { model: models_1.default.ProductImage, as: 'images' },
                    { model: models_1.default.Category, as: 'category' },
                ],
            });
            const productsMap = new Map(products.map((p) => [p.id, p]));
            const sortedProducts = productIds
                .map((id) => productsMap.get(id))
                .filter((p) => p !== undefined);
            return {
                products: sortedProducts,
                metadata: {
                    total: sortedProducts.length,
                    page: 1,
                    limit: sortedProducts.length,
                    totalPages: 1,
                },
            };
        }
        catch (error) {
            console.error('BEST SELLING FETCH ERROR:', error);
            throw error;
        }
    }
    const { count, rows } = await models_1.default.Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [
            { model: models_1.default.ProductImage, as: 'images' },
            {
                model: models_1.default.Category,
                as: 'category',
                where: query.category ? { slug: query.category } : undefined,
                required: !!query.category,
            },
        ],
        distinct: true,
    });
    const result = (0, pagination_1.getPagingData)(rows, count, page, limit);
    return {
        products: result.data,
        metadata: result.metadata,
    };
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    const product = await models_1.default.Product.findByPk(id, {
        include: [
            { model: models_1.default.ProductImage, as: 'images' },
            { model: models_1.default.Category, as: 'category' },
        ],
    });
    if (!product) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    return product;
};
exports.getProductById = getProductById;
const createProduct = async (data, files) => {
    const t = await models_2.sequelize.transaction();
    try {
        const slug = data.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        const product = await models_1.default.Product.create({ ...data, slug }, { transaction: t });
        if (files && files.length > 0) {
            const images = files.map((file, index) => ({
                productId: product.id,
                url: file.path,
                is_primary: index === 0,
            }));
            await models_1.default.ProductImage.bulkCreate(images, { transaction: t });
        }
        await t.commit();
        return await (0, exports.getProductById)(product.id);
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.createProduct = createProduct;
const updateProduct = async (id, data, files) => {
    const t = await models_2.sequelize.transaction();
    try {
        const product = await models_1.default.Product.findByPk(id, { transaction: t });
        if (!product) {
            throw new AppError_1.AppError('Product not found', 404);
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
                is_primary: false,
            }));
            await models_1.default.ProductImage.bulkCreate(images, { transaction: t });
        }
        await t.commit();
        return await (0, exports.getProductById)(id);
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const product = await models_1.default.Product.findByPk(id);
    if (!product) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    await product.destroy();
};
exports.deleteProduct = deleteProduct;
const deleteProductImage = async (id) => {
    const image = await models_1.default.ProductImage.findByPk(id);
    if (!image) {
        throw new AppError_1.AppError('Image not found', 404);
    }
    try {
        const urlParts = image.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileName.split('.')[0]}`;
        await (0, cloudinary_1.deleteImage)(publicId);
    }
    catch (err) {
        console.error('Failed to extract public ID or delete from cloud', err);
    }
    await image.destroy();
};
exports.deleteProductImage = deleteProductImage;
//# sourceMappingURL=product.service.js.map