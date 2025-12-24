'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Carts', 'sessionId', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        });

        await queryInterface.changeColumn('Carts', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Carts', 'sessionId');

        // Revert userId to not null (caution: this might fail if there are null userIds)
        // For safety in dev environment, we can try, but typically down migrations might need data migration too.
        // Here we just revert the schema definition.
        await queryInterface.changeColumn('Carts', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Keeping it nullable in down for safety or strict revert? 
            // Original was allow Null: true in the create-cart migration 006, 
            // wait, I saw 006 migration file content earlier.
            // It said allowNull: true in the code I viewed!
            // "allowNull: true, // Allow nullable for now"
            // So actually I just need to add sessionId. 
            // I will strictly add sessionId.
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    }
};
