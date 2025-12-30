import { Sequelize } from 'sequelize';
import User from './User';
import Address from './Address';
import Category from './Category';
import Product from './Product';
import ProductImage from './ProductImage';
import Cart from './Cart';
import CartItem from './CartItem';
import Order from './Order';
import OrderItem from './OrderItem';

import AnalyticsDailySummary from './AnalyticsDailySummary';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const config = require('../config/config')[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

const models = {
  User,
  Address,
  Category,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
  AnalyticsDailySummary,
};

Object.values(models).forEach((model: any) => {
  if (model.initModel) {
    model.initModel(sequelize);
  }
});

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;
