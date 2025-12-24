import models from '../models';
import { AppError } from '../utils/AppError';
import { sequelize } from '../models';

export const createAddress = async (userId: number, data: any) => {
  const t = await sequelize.transaction();
  try {
    if (data.is_default) {
      await models.Address.update(
        { is_default: false },
        { where: { userId }, transaction: t }
      );
    } else {
      // If this is the first address, make it default automatically?
      const count = await models.Address.count({ where: { userId }, transaction: t });
      if (count === 0) {
        data.is_default = true;
      }
    }

    const address = await models.Address.create(
      { ...data, userId },
      { transaction: t }
    );

    await t.commit();
    return address;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const getAllAddresses = async (userId: number) => {
  return await models.Address.findAll({ where: { userId } });
};

export const getAddressById = async (userId: number, addressId: number) => {
  const address = await models.Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    throw new AppError('Address not found', 404);
  }
  return address;
};

export const updateAddress = async (userId: number, addressId: number, data: any) => {
  const t = await sequelize.transaction();
  try {
    const address = await models.Address.findOne({
      where: { id: addressId, userId },
      transaction: t,
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (data.is_default) {
      await models.Address.update(
        { is_default: false },
        { where: { userId }, transaction: t }
      );
    }

    await address.update(data, { transaction: t });

    await t.commit();
    return address;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteAddress = async (userId: number, addressId: number) => {
  const address = await models.Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    throw new AppError('Address not found', 404);
  }
  await address.destroy();
};
