"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class AnalyticsDailySummary extends sequelize_1.Model {
    static initModel(sequelize) {
        AnalyticsDailySummary.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
                unique: true,
            },
            totalRevenue: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false,
            },
            totalOrders: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            totalItemsSold: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            newUsers: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'AnalyticsDailySummary',
            tableName: 'AnalyticsDailySummaries',
        });
    }
    static associate(_models) {
    }
}
exports.default = AnalyticsDailySummary;
//# sourceMappingURL=AnalyticsDailySummary.js.map