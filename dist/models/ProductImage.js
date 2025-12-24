"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class ProductImage extends sequelize_1.Model {
    static initModel(sequelize) {
        ProductImage.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_primary: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
        }, {
            sequelize,
            modelName: 'ProductImage',
        });
    }
    static associate(models) {
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product',
        });
    }
}
exports.default = ProductImage;
//# sourceMappingURL=ProductImage.js.map