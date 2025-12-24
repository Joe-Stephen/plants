import models from '../models';
import { AppError } from '../utils/AppError';
import { sequelize } from '../models'; // For transactions

const findOrCreateCart = async (userId: number | null, sessionId: string | null) => {
  const where: any = {};
  if (userId) {
    where.userId = userId;
  } else if (sessionId) {
    where.sessionId = sessionId;
  } else {
    throw new AppError('Either User ID or Session ID is required', 400);
  }

  let cart = await models.Cart.findOne({ where });
  if (!cart) {
    cart = await models.Cart.create(where);
  }
  return cart;
};

export const getCart = async (userId: number | null, sessionId: string | null) => {
  const where: any = {};
  if (userId) where.userId = userId;
  else if (sessionId) where.sessionId = sessionId;
  else throw new AppError('No identifier provided', 400);

  const cart = await models.Cart.findOne({
    where,
    include: [
      {
        model: models.CartItem,
        as: 'items',
        include: [{ model: models.Product, as: 'product', include: ['images'] }],
      },
    ],
  });
  return cart;
};

export const addToCart = async (
  userId: number | null,
  sessionId: string | null,
  productId: number,
  quantity: number
) => {
  const product = await models.Product.findByPk(productId);
  if (!product) throw new AppError('Product not found', 404);
  
  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  const cart = await findOrCreateCart(userId, sessionId);

  let cartItem = await models.CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    if (product.stock < cartItem.quantity) throw new AppError('Insufficient stock', 400);
    await cartItem.save();
  } else {
    await models.CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
    });
  }

  return await getCart(userId, sessionId);
};

export const updateItem = async (
  userId: number | null,
  sessionId: string | null,
  itemId: number,
  quantity: number
) => {
  if (quantity < 1) throw new AppError('Quantity must be at least 1', 400);

  const cart = await getCart(userId, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = await models.CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) throw new AppError('Item not found', 404);

  const product = await models.Product.findByPk(item.productId);
  if (!product || product.stock < quantity) throw new AppError('Insufficient stock', 400);

  item.quantity = quantity;
  await item.save();

  return await getCart(userId, sessionId);
};

export const removeItem = async (
  userId: number | null,
  sessionId: string | null,
  itemId: number
) => {
  const cart = await getCart(userId, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = await models.CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
  });
  if (!item) throw new AppError('Item not found', 404);

  await item.destroy();
  return await getCart(userId, sessionId);
};

export const mergeGuestCart = async (userId: number, guestSessionId: string) => {
  const t = await sequelize.transaction();
  try {
    const guestCart = await models.Cart.findOne({
      where: { sessionId: guestSessionId },
      include: [{ model: models.CartItem, as: 'items' }],
    });

    if (!guestCart) {
      // Nothing to merge
      await t.commit();
      return await getCart(userId, null);
    }

    let userCart = await models.Cart.findOne({ where: { userId } });
    if (!userCart) {
      userCart = await models.Cart.create({ userId }, { transaction: t });
    }

    for (const item of guestCart.items || []) {
      const existingItem = await models.CartItem.findOne({
        where: { cartId: userCart.id, productId: item.productId },
        transaction: t,
      });

      if (existingItem) {
        existingItem.quantity += item.quantity;
        await existingItem.save({ transaction: t });
      } else {
        await models.CartItem.create(
          {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      }
    }

    // Delete guest cart
    await guestCart.destroy({ transaction: t });

    await t.commit();
    return await getCart(userId, null);
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
