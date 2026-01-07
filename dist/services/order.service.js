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
const shiprocket_service_1 = require("./shiprocket.service");
const createOrder = async (userId, addressId, selectedCourierId) => {
    const transaction = await models_2.sequelize.transaction();
    try {
        const address = await models_1.default.Address.findOne({
            where: { id: addressId, userId },
        });
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
        let productTotal = 0;
        let totalWeight = 0;
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new AppError_1.AppError(`Insufficient stock for ${item.product.name}`, 400);
            }
            productTotal += parseFloat(item.product.price) * item.quantity;
            totalWeight += 0.5 * item.quantity;
        }
        const pickupPincode = parseInt(process.env.PICKUP_PINCODE || '110001');
        const deliveryPincode = parseInt(address.zip);
        const couriers = await shiprocket_service_1.shiprocketService.fetchServiceabilityRaw(pickupPincode, deliveryPincode, totalWeight, 10, 10, 10, false);
        let selectedCourier = null;
        if (selectedCourierId) {
            selectedCourier = couriers.find((c) => String(c.courier_company_id) === String(selectedCourierId));
            if (!selectedCourier) {
                throw new AppError_1.AppError('Selected courier is no longer available', 400);
            }
        }
        else {
            selectedCourier = couriers.reduce((prev, curr) => {
                return prev.rate < curr.rate ? prev : curr;
            });
        }
        const shippingCost = parseFloat(selectedCourier.rate);
        const finalTotal = productTotal + shippingCost;
        const order = await models_1.default.Order.create({
            userId,
            addressId,
            total: finalTotal,
            shippingCost: shippingCost,
            estimatedDeliveryDate: selectedCourier.etd,
            deliveryPartner: selectedCourier.courier_name,
            courierId: String(selectedCourier.courier_company_id),
            pickupPincode: String(pickupPincode),
            deliveryPincode: String(deliveryPincode),
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
            amount: Math.round(finalTotal * 100),
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
            shippingCost,
            estimatedDeliveryDate: selectedCourier.etd,
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
        const order = await models_1.default.Order.findOne({
            where: { razorpayOrderId },
            include: [
                { model: models_1.default.User, as: 'user' },
                { model: models_1.default.Address, as: 'address' },
            ],
        });
        if (!order) {
            throw new AppError_1.AppError('Order not found', 404);
        }
        if (order.status === 'PAID') {
            await transaction.rollback();
            return order;
        }
        await order.update({ status: 'PAID', razorpayPaymentId }, { transaction });
        const orderItems = await models_1.default.OrderItem.findAll({
            where: { orderId: order.id },
            include: [{ model: models_1.default.Product, as: 'product' }],
        });
        const shiprocketItems = [];
        for (const item of orderItems) {
            if (!item.productId)
                continue;
            const product = item.product;
            if (product) {
                if (product.stock < item.quantity) {
                    throw new AppError_1.AppError(`Stock ran out for product ID ${item.productId} during payment`, 400);
                }
                await product.decrement('stock', { by: item.quantity, transaction });
                shiprocketItems.push({
                    name: product.name,
                    sku: String(product.id),
                    units: item.quantity,
                    selling_price: item.price,
                    discount: '',
                    tax: '',
                    hsn: '',
                });
            }
        }
        const cart = await models_1.default.Cart.findOne({ where: { userId } });
        if (cart) {
            await models_1.default.CartItem.destroy({
                where: { cartId: cart.id },
                transaction,
            });
        }
        const nameParts = (order.user?.name || 'Customer').trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '.';
        const pickupLocationsResponse = await shiprocket_service_1.shiprocketService.getPickupLocations();
        const pickupLocations = pickupLocationsResponse.data
            ?.shipping_address;
        if (!pickupLocations || pickupLocations.length === 0) {
            throw new AppError_1.AppError('No pickup locations configured in Shiprocket', 500);
        }
        const pickupLocation = pickupLocations[0].pickup_location;
        const srOrder = await shiprocket_service_1.shiprocketService.createOrder({
            order_id: String(order.id),
            order_date: new Date(order.createdAt).toISOString(),
            pickup_location: pickupLocation,
            billing_customer_name: firstName,
            billing_last_name: lastName,
            billing_address: order.address?.street || 'Street',
            billing_city: order.address?.city || 'City',
            billing_pincode: order.address?.zip || '110001',
            billing_state: order.address?.state || 'State',
            billing_country: 'India',
            billing_email: order.user?.email || 'email@example.com',
            billing_phone: '9876543210',
            shipping_is_billing: true,
            order_items: shiprocketItems,
            payment_method: 'Prepaid',
            shipping_charges: order.shippingCost,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: order.total,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5,
        });
        await order.update({
            shiprocketOrderId: srOrder.order_id,
            shiprocketShipmentId: srOrder.shipment_id,
        }, { transaction });
        const srOrderData = srOrder;
        if (order.courierId && srOrderData.shipment_id) {
            try {
                const awbData = await shiprocket_service_1.shiprocketService.generateAWB(String(srOrderData.shipment_id), String(order.courierId));
                await order.update({
                    awbCode: awbData.awb_code,
                    trackingUrl: awbData.tracking_url ||
                        `https://shiprocket.co/tracking/${awbData.awb_code}`,
                }, { transaction });
                console.log('AWB Generated:', awbData.awb_code);
            }
            catch (awbError) {
                console.error('Failed to generate AWB immediately:', awbError);
            }
        }
        await transaction.commit();
        try {
            const { incrementStats } = require('./analytics.service');
            const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
            const today = new Date().toISOString().split('T')[0];
            incrementStats(today, Number(order.total), totalItems, false).catch((err) => {
                console.error('Failed to update analytics cache:', err);
            });
        }
        catch (e) {
            console.error('Error in analytics hook:', e);
        }
        return order;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.verifyPayment = verifyPayment;
const pagination_1 = require("../utils/pagination");
const getUserOrders = async (userId, query) => {
    const { page, limit, offset } = (0, pagination_1.getPagination)(query);
    const where = { userId };
    if (query.status) {
        where.status = query.status;
    }
    const { count, rows } = await models_1.default.Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: models_1.default.OrderItem,
                as: 'items',
                include: [
                    {
                        model: models_1.default.Product,
                        as: 'product',
                        include: [{ model: models_1.default.ProductImage, as: 'images' }],
                    },
                ],
            },
        ],
        distinct: true,
    });
    const result = (0, pagination_1.getPagingData)(rows, count, page, limit);
    return {
        orders: result.data,
        metadata: result.metadata,
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
    const { page, limit, offset } = (0, pagination_1.getPagination)(query);
    const where = {};
    if (query.status) {
        where.status = query.status;
    }
    if (query.userId) {
        where.userId = query.userId;
    }
    const { count, rows } = await models_1.default.Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: models_1.default.User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
            },
            {
                model: models_1.default.OrderItem,
                as: 'items',
                include: [
                    {
                        model: models_1.default.Product,
                        as: 'product',
                        include: [{ model: models_1.default.ProductImage, as: 'images' }],
                    },
                ],
            },
        ],
        distinct: true,
    });
    const result = (0, pagination_1.getPagingData)(rows, count, page, limit);
    return {
        orders: result.data,
        metadata: result.metadata,
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