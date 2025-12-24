"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const sequelize_1 = require("sequelize");
const models_2 = require("../models");
const getAllProducts = async (query) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
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
    const { count, rows } = await models_1.default.Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [{ model: models_1.default.ProductImage, as: 'images' }],
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
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    const product = await models_1.default.Product.findByPk(id, {
        include: [
            { model: models_1.default.ProductImage, as: 'images' },
            { model: models_1.default.Category, as: 'category' }
        ]
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
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const product = await models_1.default.Product.create({ ...data, slug }, { transaction: t });
        if (files && files.length > 0) {
            const images = files.map((file, index) => ({
                productId: product.id,
                url: file.path,
                is_primary: index === 0
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
const updateProduct = async (id, data) => {
    const product = await models_1.default.Product.findByPk(id);
    if (!product) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    if (data.name) {
        data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await product.update(data);
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
//# sourceMappingURL=product.service.js.map