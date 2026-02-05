'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add category field
        await queryInterface.addColumn('Users', 'category', {
            type: Sequelize.ENUM('entry', 'managerial', 'executive'),
            allowNull: true,
            defaultValue: null,
            comment: 'Career level categorization: entry, managerial, or executive'
        });

        // Add categorizedAt field
        await queryInterface.addColumn('Users', 'categorizedAt', {
            type: Sequelize.DATE,
            allowNull: true
        });

        // Add categorizedBy field
        await queryInterface.addColumn('Users', 'categorizedBy', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Admin email who assigned the category'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove columns in reverse order
        await queryInterface.removeColumn('Users', 'categorizedBy');
        await queryInterface.removeColumn('Users', 'categorizedAt');
        await queryInterface.removeColumn('Users', 'category');
    }
};
