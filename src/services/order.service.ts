import models from '../models'; // Import models object
import { AppError } from '../utils/AppError';
import { instance as razorpay } from '../config/razorpay';
import crypto from 'crypto';
import { sequelize } from '../models';
import { shiprocketService } from './shiprocket.service';

export const createOrder = async (
  userId: number,
  addressId: number,
  selectedCourierId?: string,
) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Validate Address
    const address = await models.Address.findOne({
      where: { id: addressId, userId },
    });
    if (!address) {
      throw new AppError('Address not found', 404);
    }

    // 2. Get User Cart
    const cart = await models.Cart.findOne({
      where: { userId },
      include: [{ model: models.CartItem, as: 'items', include: ['product'] }],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // 3. Calculate Product Total and Check Stock
    let productTotal = 0;
    let totalWeight = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }
      productTotal += parseFloat(item.product.price) * item.quantity;
      // Assume 0.5kg per item if not defined. In a real app, product should have weight field.
      totalWeight += 0.5 * item.quantity;
    }

    // 4. Calculate Shipping
    // Use default pickup pincode from env or constant
    const pickupPincode = parseInt(process.env.PICKUP_PINCODE || '110001');
    const deliveryPincode = parseInt(address.zip); // Ensure zip is numeric string

    // Check serviceability
    // Check serviceability (Get all options)
    const couriers = await shiprocketService.fetchServiceabilityRaw(
      pickupPincode,
      deliveryPincode,
      totalWeight,
      10, // length
      10, // breadth
      10, // height
      false, // cod
    );

    let selectedCourier: any = null;

    if (selectedCourierId) {
      // Find the user's selected courier
      selectedCourier = couriers.find(
        (c: any) => String(c.courier_company_id) === String(selectedCourierId),
      );
      if (!selectedCourier) {
        throw new AppError('Selected courier is no longer available', 400);
      }
    } else {
      // Fallback to Cheapest (Default)
      selectedCourier = couriers.reduce((prev: any, curr: any) => {
        return prev.rate < curr.rate ? prev : curr;
      });
    }

    const shippingCost = parseFloat(selectedCourier.rate);
    const finalTotal = productTotal + shippingCost;

    // 5. Create Order (Pending)
    const order = await models.Order.create(
      {
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
      },
      { transaction },
    );

    // 6. Create Order Items
    const orderItems = cart.items.map((item: any) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
    await models.OrderItem.bulkCreate(orderItems, { transaction });

    // 7. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${order.id}`,
    });

    // 7. Update Order with Razorpay Order ID
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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const verifyPayment = async (
  userId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Verify Signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // 2. Find Order
    const order = await models.Order.findOne({
      where: { razorpayOrderId },
      include: [
        { model: models.User, as: 'user' },
        { model: models.Address, as: 'address' },
      ],
    });
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === 'PAID') {
      await transaction.rollback();
      return order; // Already paid
    }

    // 3. Update Order Status
    await order.update({ status: 'PAID', razorpayPaymentId }, { transaction });

    // 4. Deduct Stock
    // We need to fetch items again or assume they matched (better to fetch from DB to be safe)
    const orderItems = await models.OrderItem.findAll({
      where: { orderId: order.id },
    });

    for (const item of orderItems) {
      if (!item.productId) continue;
      const product = await models.Product.findByPk(item.productId, {
        transaction,
      });
      if (product) {
        if (product.stock < item.quantity) {
          throw new AppError(
            `Stock ran out for product ID ${item.productId} during payment`,
            400,
          );
        }
        await product.decrement('stock', { by: item.quantity, transaction });
      }
    }

    // 5. Clear User Cart
    const cart = await models.Cart.findOne({ where: { userId } });
    if (cart) {
      await models.CartItem.destroy({
        where: { cartId: cart.id },
        transaction,
      });
    }

    // 6. Create Shiprocket Order
    // Note: We create this AFTER reducing stock but BEFORE committing transaction
    const srOrder = await shiprocketService.createOrder({
      order_id: String(order.id),
      order_date: new Date(order.createdAt).toISOString(),
      pickup_location: 'Primary', // Should be configured in SR
      billing_customer_name: order.user?.name || 'Customer',
      billing_last_name: '',
      billing_address: order.address?.street || 'Street',
      billing_city: order.address?.city || 'City',
      billing_pincode: order.address?.zip || '110001',
      billing_state: order.address?.state || 'State',
      billing_country: 'India',
      billing_email: order.user?.email || 'email@example.com',
      billing_phone: '9999999999', // Should be in Address/User
      shipping_is_billing: true,
      order_items: orderItems.map((item: any) => ({
        name: 'Plant ' + item.productId,
        sku: 'SKU' + item.productId,
        units: item.quantity,
        selling_price: '100', // Need actual price in Item
        discount: '',
        tax: '',
        hsn: '',
      })),
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

    await order.update(
      {
        shiprocketOrderId: (srOrder as any).order_id,
        shiprocketShipmentId: (srOrder as any).shipment_id,
      },
      { transaction },
    );

    // 7. Generate AWB
    // Note: Use type assertion as createOrder return type might be implicit/any
    const srOrderData = srOrder as any;
    if (order.courierId && srOrderData.shipment_id) {
      try {
        const awbData = await shiprocketService.generateAWB(
          String(srOrderData.shipment_id),
          String(order.courierId),
        );
        await order.update(
          {
            awbCode: awbData.awb_code,
            trackingUrl:
              awbData.tracking_url ||
              `https://shiprocket.co/tracking/${awbData.awb_code}`,
          },
          { transaction },
        );
        console.log('AWB Generated:', awbData.awb_code);
      } catch (awbError) {
        console.error('Failed to generate AWB immediately:', awbError);
      }
    }

    await transaction.commit();

    // Analytics Hook - Fire and forget (don't block response)
    try {
      const { incrementStats } = require('./analytics.service');
      const totalItems = orderItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      );
      const today = new Date().toISOString().split('T')[0];

      incrementStats(today, Number(order.total), totalItems, false).catch(
        (err: any) => {
          console.error('Failed to update analytics cache:', err);
        },
      );
    } catch (e) {
      console.error('Error in analytics hook:', e);
    }

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

import { getPagination, getPagingData } from '../utils/pagination';

export const getUserOrders = async (userId: number, query: any) => {
  const { page, limit, offset } = getPagination(query);
  const where: any = { userId };

  if (query.status) {
    where.status = query.status;
  }

  const { count, rows } = await models.Order.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: models.OrderItem,
        as: 'items',
        include: [
          {
            model: models.Product,
            as: 'product',
            include: [{ model: models.ProductImage, as: 'images' }],
          },
        ],
      },
    ],
    distinct: true,
  });

  const result = getPagingData(rows, count, page, limit);

  return {
    orders: result.data,
    metadata: result.metadata,
  };
};

export const getOrderById = async (orderId: number, userId?: number) => {
  const where: any = { id: orderId };
  if (userId) {
    where.userId = userId;
  }

  const order = await models.Order.findOne({
    where,
    include: [
      { model: models.OrderItem, as: 'items', include: ['product'] },
      { model: models.Address, as: 'address' },
      { model: models.User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

export const getAllOrders = async (query: any) => {
  const { page, limit, offset } = getPagination(query);
  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }
  if (query.userId) {
    where.userId = query.userId;
  }

  const { count, rows } = await models.Order.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: models.User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: models.OrderItem,
        as: 'items',
        include: [
          {
            model: models.Product,
            as: 'product',
            include: [{ model: models.ProductImage, as: 'images' }],
          },
        ],
      },
    ],
    distinct: true,
  });

  const result = getPagingData(rows, count, page, limit);

  return {
    orders: result.data,
    metadata: result.metadata,
  };
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const order = await models.Order.findByPk(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  await order.update({ status: status as any });
  return order;
};
