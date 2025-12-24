"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Address extends sequelize_1.Model {
    static initModel(sequelize) {
        Address.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            street: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            zip: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_default: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
        }, {
            sequelize,
            modelName: 'Address',
        });
    }
    static associate(models) {
        Address.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Address.hasMany(models.Order, { foreignKey: 'addressId', as: 'orders' });
    }
}
exports.default = Address;
//# sourceMappingURL=Address.js.map