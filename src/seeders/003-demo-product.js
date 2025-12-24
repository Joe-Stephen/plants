'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Fetch categories to get IDs
        const categories = await queryInterface.sequelize.query(
            `SELECT id, slug from Categories;`
        );
        const categoryRows = categories[0];

        const indoor = categoryRows.find(c => c.slug === 'indoor-plants');
        const succulent = categoryRows.find(c => c.slug === 'succulents');

        // Insert Products
        await queryInterface.bulkInsert('Products', [
            {
                categoryId: indoor ? indoor.id : null,
                name: 'Monstera Deliciosa',
                slug: 'monstera-deliciosa',
                description: 'The Swiss Cheese Plant.',
                price: 29.99,
                stock: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: indoor ? indoor.id : null,
                name: 'Fiddle Leaf Fig',
                slug: 'fiddle-leaf-fig',
                description: 'Popular indoor tree.',
                price: 45.00,
                stock: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: succulent ? succulent.id : null,
                name: 'Aloe Vera',
                slug: 'aloe-vera',
                description: 'Medicinal succulent.',
                price: 12.50,
                stock: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

        // We need to get the product IDs to seed images, or we can assume IDs if auto-increment is predictable, 
        // but better to fetch them.
        const products = await queryInterface.sequelize.query(
            `SELECT id, slug from Products;`
        );
        const productRows = products[0];

        const monstera = productRows.find(p => p.slug === 'monstera-deliciosa');
        const fiddle = productRows.find(p => p.slug === 'fiddle-leaf-fig');
        const aloe = productRows.find(p => p.slug === 'aloe-vera');

        const productImages = [];

        if (monstera) {
            productImages.push({
                productId: monstera.id,
                url: '/images/monstera.jpg',
                is_primary: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (fiddle) {
            productImages.push({
                productId: fiddle.id,
                url: '/images/fiddle-leaf.jpg',
                is_primary: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (aloe) {
            productImages.push({
                productId: aloe.id,
                url: '/images/aloe-vera.jpg',
                is_primary: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (productImages.length > 0) {
            await queryInterface.bulkInsert('ProductImages', productImages, {});
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('ProductImages', null, {});
        await queryInterface.bulkDelete('Products', null, {});
    }
};
