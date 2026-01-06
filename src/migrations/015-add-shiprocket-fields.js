'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'shippingCost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    await queryInterface.addColumn('Orders', 'estimatedDeliveryDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'deliveryPartner', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'shiprocketOrderId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'shiprocketShipmentId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'awbCode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'shippingCost');
    await queryInterface.removeColumn('Orders', 'estimatedDeliveryDate');
    await queryInterface.removeColumn('Orders', 'deliveryPartner');
    await queryInterface.removeColumn('Orders', 'shiprocketOrderId');
    await queryInterface.removeColumn('Orders', 'shiprocketShipmentId');
    await queryInterface.removeColumn('Orders', 'awbCode');
  },
};
