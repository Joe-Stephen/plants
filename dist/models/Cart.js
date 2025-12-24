"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Cart extends sequelize_1.Model {
    static initModel(sequelize) {
        Cart.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            sessionId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
        }, {
            sequelize,
            modelName: 'Cart',
        });
    }
    static associate(models) {
        Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
    }
}
exports.default = Cart;
//# sourceMappingURL=Cart.js.map