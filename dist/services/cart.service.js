"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeGuestCart = exports.removeItem = exports.updateItem = exports.addToCart = exports.getCart = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const models_2 = require("../models");
const findOrCreateCart = async (userId, sessionId) => {
    const where = {};
    if (userId) {
        where.userId = userId;
    }
    else if (sessionId) {
        where.sessionId = sessionId;
    }
    else {
        throw new AppError_1.AppError('Either User ID or Session ID is required', 400);
    }
    let cart = await models_1.default.Cart.findOne({ where });
    if (!cart) {
        cart = await models_1.default.Cart.create(where);
    }
    return cart;
};
const getCart = async (userId, sessionId) => {
    const where = {};
    if (userId)
        where.userId = userId;
    else if (sessionId)
        where.sessionId = sessionId;
    else
        throw new AppError_1.AppError('No identifier provided', 400);
    const cart = await models_1.default.Cart.findOne({
        where,
        include: [
            {
                model: models_1.default.CartItem,
                as: 'items',
                include: [{ model: models_1.default.Product, as: 'product', include: ['images'] }],
            },
        ],
    });
    return cart;
};
exports.getCart = getCart;
const addToCart = async (userId, sessionId, productId, quantity) => {
    const product = await models_1.default.Product.findByPk(productId);
    if (!product)
        throw new AppError_1.AppError('Product not found', 404);
    if (product.stock < quantity) {
        throw new AppError_1.AppError('Insufficient stock', 400);
    }
    const cart = await findOrCreateCart(userId, sessionId);
    let cartItem = await models_1.default.CartItem.findOne({
        where: { cartId: cart.id, productId },
    });
    if (cartItem) {
        cartItem.quantity += quantity;
        if (product.stock < cartItem.quantity)
            throw new AppError_1.AppError('Insufficient stock', 400);
        await cartItem.save();
    }
    else {
        await models_1.default.CartItem.create({
            cartId: cart.id,
            productId,
            quantity,
        });
    }
    return await (0, exports.getCart)(userId, sessionId);
};
exports.addToCart = addToCart;
const updateItem = async (userId, sessionId, itemId, quantity) => {
    if (quantity < 1)
        throw new AppError_1.AppError('Quantity must be at least 1', 400);
    const cart = await (0, exports.getCart)(userId, sessionId);
    if (!cart)
        throw new AppError_1.AppError('Cart not found', 404);
    const item = await models_1.default.CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
    });
    if (!item)
        throw new AppError_1.AppError('Item not found', 404);
    const product = await models_1.default.Product.findByPk(item.productId);
    if (!product || product.stock < quantity)
        throw new AppError_1.AppError('Insufficient stock', 400);
    item.quantity = quantity;
    await item.save();
    return await (0, exports.getCart)(userId, sessionId);
};
exports.updateItem = updateItem;
const removeItem = async (userId, sessionId, itemId) => {
    const cart = await (0, exports.getCart)(userId, sessionId);
    if (!cart)
        throw new AppError_1.AppError('Cart not found', 404);
    const item = await models_1.default.CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
    });
    if (!item)
        throw new AppError_1.AppError('Item not found', 404);
    await item.destroy();
    return await (0, exports.getCart)(userId, sessionId);
};
exports.removeItem = removeItem;
const mergeGuestCart = async (userId, guestSessionId) => {
    const t = await models_2.sequelize.transaction();
    try {
        const guestCart = await models_1.default.Cart.findOne({
            where: { sessionId: guestSessionId },
            include: [{ model: models_1.default.CartItem, as: 'items' }],
        });
        if (!guestCart) {
            await t.commit();
            return await (0, exports.getCart)(userId, null);
        }
        let userCart = await models_1.default.Cart.findOne({ where: { userId } });
        if (!userCart) {
            userCart = await models_1.default.Cart.create({ userId }, { transaction: t });
        }
        for (const item of guestCart.items || []) {
            const existingItem = await models_1.default.CartItem.findOne({
                where: { cartId: userCart.id, productId: item.productId },
                transaction: t,
            });
            if (existingItem) {
                existingItem.quantity += item.quantity;
                await existingItem.save({ transaction: t });
            }
            else {
                await models_1.default.CartItem.create({
                    cartId: userCart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                }, { transaction: t });
            }
        }
        await guestCart.destroy({ transaction: t });
        await t.commit();
        return await (0, exports.getCart)(userId, null);
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.mergeGuestCart = mergeGuestCart;
//# sourceMappingURL=cart.service.js.map