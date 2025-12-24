"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.getUserOrders = exports.verifyPayment = exports.createOrder = void 0;
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../utils/AppError");
const razorpay_1 = require("../config/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const models_2 = require("../models");
const createOrder = async (userId, addressId) => {
    const transaction = await models_2.sequelize.transaction();
    try {
        const address = await models_1.default.Address.findOne({ where: { id: addressId, userId } });
        if (!address) {
            throw new AppError_1.AppError('Address not found', 404);
        }
        const cart = await models_1.default.Cart.findOne({
            where: { userId },
            include: [{ model: models_1.default.CartItem, as: 'items', include: ['product'] }],
        });
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new AppError_1.AppError('Cart is empty', 400);
        }
        let total = 0;
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new AppError_1.AppError(`Insufficient stock for ${item.product.name}`, 400);
            }
            total += parseFloat(item.product.price) * item.quantity;
        }
        const order = await models_1.default.Order.create({
            userId,
            addressId,
            total,
            status: 'PENDING',
        }, { transaction });
        const orderItems = cart.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
        }));
        await models_1.default.OrderItem.bulkCreate(orderItems, { transaction });
        const razorpayOrder = await razorpay_1.instance.orders.create({
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: `order_${order.id}`,
        });
        await order.update({ razorpayOrderId: razorpayOrder.id }, { transaction });
        await transaction.commit();
        return {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.createOrder = createOrder;
const verifyPayment = async (userId, razorpayOrderId, razorpayPaymentId, signature) => {
    const transaction = await models_2.sequelize.transaction();
    try {
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
            .update(body.toString())
            .digest('hex');
        if (expectedSignature !== signature) {
            throw new AppError_1.AppError('Invalid payment signature', 400);
        }
        const order = await models_1.default.Order.findOne({ where: { razorpayOrderId } });
        if (!order) {
            throw new AppError_1.AppError('Order not found', 404);
        }
        if (order.status === 'PAID') {
            await transaction.rollback();
            return order;
        }
        await order.update({ status: 'PAID', razorpayPaymentId }, { transaction });
        const orderItems = await models_1.default.OrderItem.findAll({ where: { orderId: order.id } });
        for (const item of orderItems) {
            if (!item.productId)
                continue;
            const product = await models_1.default.Product.findByPk(item.productId, { transaction });
            if (product) {
                if (product.stock < item.quantity) {
                    throw new AppError_1.AppError(`Stock ran out for product ID ${item.productId} during payment`, 400);
                }
                await product.decrement('stock', { by: item.quantity, transaction });
            }
        }
        const cart = await models_1.default.Cart.findOne({ where: { userId } });
        if (cart) {
            await models_1.default.CartItem.destroy({ where: { cartId: cart.id }, transaction });
        }
        await transaction.commit();
        return order;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.verifyPayment = verifyPayment;
const getUserOrders = async (userId, query) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const where = { userId };
    if (query.status) {
        where.status = query.status;
    }
    const { count, rows } = await models_1.default.Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: models_1.default.OrderItem, as: 'items' }],
        distinct: true,
    });
    return {
        orders: rows,
        metadata: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (orderId, userId) => {
    const where = { id: orderId };
    if (userId) {
        where.userId = userId;
    }
    const order = await models_1.default.Order.findOne({
        where,
        include: [
            { model: models_1.default.OrderItem, as: 'items', include: ['product'] },
            { model: models_1.default.Address, as: 'address' },
            { model: models_1.default.User, as: 'user', attributes: ['id', 'name', 'email'] },
        ],
    });
    if (!order) {
        throw new AppError_1.AppError('Order not found', 404);
    }
    return order;
};
exports.getOrderById = getOrderById;
const getAllOrders = async (query) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    const where = {};
    if (query.status) {
        where.status = query.status;
    }
    const { count, rows } = await models_1.default.Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
            { model: models_1.default.User, as: 'user', attributes: ['id', 'name', 'email'] },
            { model: models_1.default.OrderItem, as: 'items' },
        ],
        distinct: true,
    });
    return {
        orders: rows,
        metadata: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (orderId, status) => {
    const order = await models_1.default.Order.findByPk(orderId);
    if (!order) {
        throw new AppError_1.AppError('Order not found', 404);
    }
    await order.update({ status: status });
    return order;
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.service.js.map