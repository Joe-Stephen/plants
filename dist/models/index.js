"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
const Address_1 = __importDefault(require("./Address"));
const Category_1 = __importDefault(require("./Category"));
const Product_1 = __importDefault(require("./Product"));
const ProductImage_1 = __importDefault(require("./ProductImage"));
const Cart_1 = __importDefault(require("./Cart"));
const CartItem_1 = __importDefault(require("./CartItem"));
const Order_1 = __importDefault(require("./Order"));
const OrderItem_1 = __importDefault(require("./OrderItem"));
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = config.url
    ? new sequelize_1.Sequelize(config.url, config)
    : new sequelize_1.Sequelize(config.database, config.username, config.password, config);
exports.sequelize = sequelize;
const models = {
    User: User_1.default,
    Address: Address_1.default,
    Category: Category_1.default,
    Product: Product_1.default,
    ProductImage: ProductImage_1.default,
    Cart: Cart_1.default,
    CartItem: CartItem_1.default,
    Order: Order_1.default,
    OrderItem: OrderItem_1.default,
};
Object.values(models).forEach((model) => {
    if (model.initModel) {
        model.initModel(sequelize);
    }
});
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});
exports.default = models;
//# sourceMappingURL=index.js.map