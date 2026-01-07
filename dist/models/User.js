"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM('USER', 'ADMIN'),
                defaultValue: 'USER',
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
            },
        }, {
            sequelize,
            modelName: 'User',
        });
    }
    static associate(models) {
        User.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses' });
        User.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart' });
        User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map