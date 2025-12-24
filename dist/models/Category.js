"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
    static initModel(sequelize) {
        Category.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            parentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'Category',
        });
    }
    static associate(models) {
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId',
            as: 'products',
        });
        Category.belongsTo(models.Category, {
            foreignKey: 'parentId',
            as: 'parent',
        });
        Category.hasMany(models.Category, {
            foreignKey: 'parentId',
            as: 'children',
        });
    }
}
exports.default = Category;
//# sourceMappingURL=Category.js.map