'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AnalyticsDailySummaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true,
      },
      totalRevenue: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
      },
      totalOrders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      totalItemsSold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      newUsers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('AnalyticsDailySummaries', ['date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AnalyticsDailySummaries');
  },
};
