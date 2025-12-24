'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Categories', [
            {
                name: 'Indoor Plants',
                slug: 'indoor-plants',
                description: 'Plants that thrive indoors.',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Succulents',
                slug: 'succulents',
                description: 'Drought resistant plants.',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Pots & Planters',
                slug: 'pots-planters',
                description: 'Containers for your plants.',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
