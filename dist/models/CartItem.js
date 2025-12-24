"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class CartItem extends sequelize_1.Model {
    static initModel(sequelize) {
        CartItem.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cartId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 1,
            },
        }, {
            sequelize,
            modelName: 'CartItem',
        });
    }
    static associate(models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product',
        });
    }
}
exports.default = CartItem;
//# sourceMappingURL=CartItem.js.map