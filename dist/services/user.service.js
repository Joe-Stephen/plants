"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.updateUserRole = exports.getUserById = exports.getAllUsers = void 0;
const models_1 = __importDefault(require("../models"));
const pagination_1 = require("../utils/pagination");
const AppError_1 = require("../utils/AppError");
const sequelize_1 = require("sequelize");
const getAllUsers = async (query) => {
    const { page, limit, offset } = (0, pagination_1.getPagination)(query);
    const where = {};
    if (query.search) {
        where[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.like]: `%${query.search}%` } },
            { email: { [sequelize_1.Op.like]: `%${query.search}%` } },
        ];
    }
    if (query.status) {
        where.status = query.status;
    }
    if (query.role) {
        where.role = query.role;
    }
    const { count, rows } = await models_1.default.User.findAndCountAll({
        where,
        limit,
        offset,
        attributes: { exclude: ['password_hash'] },
        order: [['createdAt', 'DESC']],
    });
    const result = (0, pagination_1.getPagingData)(rows, count, page, limit);
    return {
        users: result.data,
        metadata: result.metadata,
    };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const user = await models_1.default.User.findByPk(id, {
        attributes: { exclude: ['password_hash'] },
        include: [
            {
                model: models_1.default.Address,
                as: 'addresses',
            },
        ],
    });
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const ordersCount = await models_1.default.Order.count({ where: { userId: id } });
    return {
        ...user.toJSON(),
        ordersCount,
    };
};
exports.getUserById = getUserById;
const updateUserRole = async (id, role) => {
    const user = await models_1.default.User.findByPk(id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    await user.update({ role });
    return user.reload({ attributes: { exclude: ['password_hash'] } });
};
exports.updateUserRole = updateUserRole;
const updateUserStatus = async (id, status) => {
    const user = await models_1.default.User.findByPk(id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    await user.update({ status });
    return user.reload({ attributes: { exclude: ['password_hash'] } });
};
exports.updateUserStatus = updateUserStatus;
//# sourceMappingURL=user.service.js.map