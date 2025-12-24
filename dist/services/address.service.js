"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getAllAddresses = exports.createAddress = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const models_2 = require("../models");
const createAddress = async (userId, data) => {
    const t = await models_2.sequelize.transaction();
    try {
        if (data.is_default) {
            await models_1.default.Address.update({ is_default: false }, { where: { userId }, transaction: t });
        }
        else {
            const count = await models_1.default.Address.count({ where: { userId }, transaction: t });
            if (count === 0) {
                data.is_default = true;
            }
        }
        const address = await models_1.default.Address.create({ ...data, userId }, { transaction: t });
        await t.commit();
        return address;
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.createAddress = createAddress;
const getAllAddresses = async (userId) => {
    return await models_1.default.Address.findAll({ where: { userId } });
};
exports.getAllAddresses = getAllAddresses;
const getAddressById = async (userId, addressId) => {
    const address = await models_1.default.Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
        throw new AppError_1.AppError('Address not found', 404);
    }
    return address;
};
exports.getAddressById = getAddressById;
const updateAddress = async (userId, addressId, data) => {
    const t = await models_2.sequelize.transaction();
    try {
        const address = await models_1.default.Address.findOne({
            where: { id: addressId, userId },
            transaction: t,
        });
        if (!address) {
            throw new AppError_1.AppError('Address not found', 404);
        }
        if (data.is_default) {
            await models_1.default.Address.update({ is_default: false }, { where: { userId }, transaction: t });
        }
        await address.update(data, { transaction: t });
        await t.commit();
        return address;
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (userId, addressId) => {
    const address = await models_1.default.Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
        throw new AppError_1.AppError('Address not found', 404);
    }
    await address.destroy();
};
exports.deleteAddress = deleteAddress;
//# sourceMappingURL=address.service.js.map