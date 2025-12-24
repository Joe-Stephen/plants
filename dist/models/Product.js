"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
    static initModel(sequelize) {
        Product.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            categoryId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            stock: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
        }, {
            sequelize,
            modelName: 'Product',
        });
    }
    static associate(models) {
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category',
        });
        Product.hasMany(models.ProductImage, {
            foreignKey: 'productId',
            as: 'images',
        });
        Product.hasMany(models.CartItem, { foreignKey: 'productId' });
        Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
    }
}
exports.default = Product;
//# sourceMappingURL=Product.js.map