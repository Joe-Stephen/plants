"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Order extends sequelize_1.Model {
    static initModel(sequelize) {
        Order.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            addressId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            total: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                defaultValue: 'PENDING',
            },
            razorpayOrderId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            razorpayPaymentId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'Order',
        });
    }
    static associate(models) {
        Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Order.belongsTo(models.Address, { foreignKey: 'addressId', as: 'address' });
        Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    }
}
exports.default = Order;
//# sourceMappingURL=Order.js.map