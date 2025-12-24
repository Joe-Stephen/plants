"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class OrderItem extends sequelize_1.Model {
    static initModel(sequelize) {
        OrderItem.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'OrderItem',
        });
    }
    static associate(models) {
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product',
        });
    }
}
exports.default = OrderItem;
//# sourceMappingURL=OrderItem.js.map