'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const password = await bcrypt.hash('password123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password_hash: password,
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password_hash: password,
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
