'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Orders', 'razorpayOrderId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Orders', 'razorpayPaymentId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Orders', 'razorpayOrderId');
        await queryInterface.removeColumn('Orders', 'razorpayPaymentId');
    }
};
