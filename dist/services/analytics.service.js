"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockProducts = exports.getTopProducts = exports.getCategorySales = exports.getOrdersByStatus = exports.getNewUsersChart = exports.getSalesChart = exports.getDashboardStats = exports.incrementStats = void 0;
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
const AnalyticsDailySummary_1 = __importDefault(require("../models/AnalyticsDailySummary"));
const incrementStats = async (date, revenue, itemsCount, isNewUser) => {
    const summary = await AnalyticsDailySummary_1.default.findOne({ where: { date } });
    if (summary) {
        await summary.increment({
            totalRevenue: revenue,
            totalOrders: 1,
            totalItemsSold: itemsCount,
            newUsers: isNewUser ? 1 : 0,
        });
    }
    else {
        await AnalyticsDailySummary_1.default.create({
            date,
            totalRevenue: revenue,
            totalOrders: 1,
            totalItemsSold: itemsCount,
            newUsers: isNewUser ? 1 : 0,
        });
    }
};
exports.incrementStats = incrementStats;
const getCompletedOrderWhereClause = (range) => ({
    status: { [sequelize_1.Op.in]: ['PAID', 'SHIPPED', 'DELIVERED'] },
    createdAt: { [sequelize_1.Op.between]: [range.startDate, range.endDate] },
});
const getDashboardStats = async (startDate, endDate) => {
    const range = { startDate, endDate };
    const revenueResult = await models_1.default.Order.sum('total', {
        where: getCompletedOrderWhereClause(range),
    });
    const totalRevenue = revenueResult || 0;
    const totalOrders = await models_1.default.Order.count({
        where: {
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const newUsers = await models_1.default.User.count({
        where: {
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const lowStockCount = await models_1.default.Product.count({
        where: {
            stock: { [sequelize_1.Op.lt]: 10 },
        },
    });
    const outOfStockCount = await models_1.default.Product.count({
        where: { stock: 0 },
    });
    const totalProducts = await models_1.default.Product.count();
    const totalUsers = await models_1.default.User.count();
    return {
        totalRevenue,
        totalOrders,
        newUsers,
        lowStockCount,
        outOfStockCount,
        totalProducts,
        totalUsers,
    };
};
exports.getDashboardStats = getDashboardStats;
const getSalesChart = async (startDate, endDate, groupBy = 'day') => {
    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
    const salesData = await models_1.default.Order.findAll({
        attributes: [
            [
                sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
                'date',
            ],
            [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('total')), 'revenue'],
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
        ],
        where: {
            status: { [sequelize_1.Op.in]: ['PAID', 'SHIPPED', 'DELIVERED'] },
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        group: [
            sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
        ],
        order: [
            [
                sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
                'ASC',
            ],
        ],
        raw: true,
    });
    return salesData.map((item) => ({
        date: item.date,
        revenue: parseFloat(item.revenue) || 0,
        count: parseInt(item.count, 10) || 0,
    }));
};
exports.getSalesChart = getSalesChart;
const getNewUsersChart = async (startDate, endDate, groupBy = 'day') => {
    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
    const users = await models_1.default.User.findAll({
        attributes: [
            [
                sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
                'date',
            ],
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
        ],
        where: {
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        group: [
            sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
        ],
        order: [
            [
                sequelize_1.Sequelize.fn('DATE_FORMAT', sequelize_1.Sequelize.col('createdAt'), dateFormat),
                'ASC',
            ],
        ],
        raw: true,
    });
    return users;
};
exports.getNewUsersChart = getNewUsersChart;
const getOrdersByStatus = async (startDate, endDate) => {
    const stats = await models_1.default.Order.findAll({
        attributes: [
            'status',
            [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count'],
        ],
        where: {
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        group: ['status'],
        raw: true,
    });
    return stats;
};
exports.getOrdersByStatus = getOrdersByStatus;
const getCategorySales = async (startDate, endDate) => {
    const categorySales = await models_1.default.OrderItem.findAll({
        attributes: [
            [sequelize_1.Sequelize.col('product.category.name'), 'categoryName'],
            [
                sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`')),
                'revenue',
            ],
            [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('quantity')), 'itemsSold'],
        ],
        include: [
            {
                model: models_1.default.Order,
                as: 'order',
                attributes: [],
                where: getCompletedOrderWhereClause({ startDate, endDate }),
            },
            {
                model: models_1.default.Product,
                as: 'product',
                attributes: [],
                include: [
                    {
                        model: models_1.default.Category,
                        as: 'category',
                        attributes: ['name'],
                    },
                ],
            },
        ],
        group: ['product.category.id', 'product.category.name'],
        order: [
            [
                sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`')),
                'DESC',
            ],
        ],
        raw: true,
    });
    return categorySales;
};
exports.getCategorySales = getCategorySales;
const getTopProducts = async (startDate, endDate, limit = 5) => {
    const topItems = await models_1.default.OrderItem.findAll({
        attributes: [
            'productId',
            [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('quantity')), 'totalSold'],
            [
                sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`')),
                'revenue',
            ],
        ],
        include: [
            {
                model: models_1.default.Order,
                as: 'order',
                attributes: [],
                where: getCompletedOrderWhereClause({ startDate, endDate }),
            },
        ],
        group: ['productId'],
        order: [[sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('quantity')), 'DESC']],
        limit,
        raw: true,
    });
    const productIds = topItems
        .map((item) => item.productId)
        .filter((id) => id);
    const products = await models_1.default.Product.findAll({
        where: { id: { [sequelize_1.Op.in]: productIds } },
        attributes: ['id', 'name', 'price'],
        include: [{ model: models_1.default.ProductImage, as: 'images' }],
    });
    const result = topItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
            productId: item.productId,
            totalSold: item.totalSold,
            revenue: item.revenue,
            name: product ? product.name : 'Unknown Product',
            price: product ? product.price : 0,
            image: product && product.images && product.images.length > 0
                ? product.images.find((img) => img.is_primary)?.url ||
                    product.images[0].url
                : null,
        };
    });
    return result;
};
exports.getTopProducts = getTopProducts;
const getLowStockProducts = async (threshold = 10) => {
    const products = await models_1.default.Product.findAll({
        where: {
            stock: { [sequelize_1.Op.lt]: threshold },
        },
        attributes: ['id', 'name', 'stock', 'price'],
        order: [['stock', 'ASC']],
        limit: 20,
    });
    return products;
};
exports.getLowStockProducts = getLowStockProducts;
//# sourceMappingURL=analytics.service.js.map