"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const getAllCategories = async () => {
    return await models_1.default.Category.findAll({ include: [{ model: models_1.default.Category, as: 'children' }] });
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    const category = await models_1.default.Category.findByPk(id, { include: [{ model: models_1.default.Category, as: 'children' }] });
    if (!category) {
        throw new AppError_1.AppError('Category not found', 404);
    }
    return category;
};
exports.getCategoryById = getCategoryById;
const createCategory = async (data) => {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existing = await models_1.default.Category.findOne({ where: { slug } });
    if (existing) {
        throw new AppError_1.AppError('Category with this name already exists', 400);
    }
    return await models_1.default.Category.create({ ...data, slug });
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    const category = await models_1.default.Category.findByPk(id);
    if (!category) {
        throw new AppError_1.AppError('Category not found', 404);
    }
    if (data.name) {
        data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await category.update(data);
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const category = await models_1.default.Category.findByPk(id);
    if (!category) {
        throw new AppError_1.AppError('Category not found', 404);
    }
    await category.destroy();
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.service.js.map