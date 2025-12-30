import models from '../models';
import { Op, Sequelize } from 'sequelize';
import AnalyticsDailySummary from '../models/AnalyticsDailySummary';

export const incrementStats = async (
  date: string,
  revenue: number,
  itemsCount: number,
  isNewUser: boolean,
) => {
  const summary = await AnalyticsDailySummary.findOne({ where: { date } });

  if (summary) {
    await summary.increment({
      totalRevenue: revenue,
      totalOrders: 1,
      totalItemsSold: itemsCount,
      newUsers: isNewUser ? 1 : 0,
    });
  } else {
    await AnalyticsDailySummary.create({
      date,
      totalRevenue: revenue,
      totalOrders: 1,
      totalItemsSold: itemsCount,
      newUsers: isNewUser ? 1 : 0,
    });
  }
};

interface DateRange {
  startDate: Date;
  endDate: Date;
}

const getCompletedOrderWhereClause = (range: DateRange) => ({
  status: { [Op.in]: ['PAID', 'SHIPPED', 'DELIVERED'] },
  createdAt: { [Op.between]: [range.startDate, range.endDate] },
});

export const getDashboardStats = async (startDate: Date, endDate: Date) => {
  const range = { startDate, endDate };

  // 1. Total Revenue (Paid Orders Only)
  const revenueResult = await models.Order.sum('total', {
    where: getCompletedOrderWhereClause(range),
  });
  const totalRevenue = revenueResult || 0;

  // 2. Total Orders (All statuses, in range)
  const totalOrders = await models.Order.count({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  // 3. New Users
  const newUsers = await models.User.count({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  // 4. Low Stock Products (< 10) - Snapshot (always current)
  const lowStockCount = await models.Product.count({
    where: {
      stock: { [Op.lt]: 10 },
    },
  });

  // 5. Out of Stock
  const outOfStockCount = await models.Product.count({
    where: { stock: 0 },
  });

  return {
    totalRevenue,
    totalOrders,
    newUsers,
    lowStockCount,
    outOfStockCount,
  };
};

export const getSalesChart = async (
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'month' = 'day',
) => {
  // Optimization: Use cached data for past dates, live data for today

  // 1. Identify "Today" to split query
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Format dates for comparison
  const todayStr = today.toISOString().split('T')[0];

  // 2. Fetch Historical Data from Cache (AnalyticsDailySummary)
  // Condition: date >= startDate AND date <= endDate AND date < today

  const cachedData = await AnalyticsDailySummary.findAll({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
        [Op.lt]: todayStr, // Exclude today from cache, rely on live query
      },
    },
    attributes: ['date', ['totalRevenue', 'revenue'], ['totalOrders', 'count']],
    raw: true,
  });

  // 3. Fetch Live Data for Today (if today is in range)
  let liveData: any = [];
  if (endDate >= today && startDate <= today) {
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    liveData = await models.Order.findAll({
      attributes: [
        [
          Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'),
          'date',
        ],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: getCompletedOrderWhereClause({
        startDate: today,
        endDate: endOfToday,
      }),
      group: [
        Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'),
      ],
      raw: true,
    });
  }

  // 4. Merge & Group (if groupBy month)
  // For 'day' grouping, we can just concat.
  const allData = [...cachedData, ...liveData].map((item: any) => ({
    ...item,
    revenue: parseFloat(item.revenue),
    count: parseInt(item.count, 10) || 0,
  }));

  if (groupBy === 'day') {
    // Sort by date
    return allData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } else {
    // Group by Month
    // Map 'YYYY-MM-DD' -> 'YYYY-MM' and aggregate
    const monthly: Record<string, any> = {};

    for (const item of allData) {
      const month = item.date.substring(0, 7); // YYYY-MM
      if (!monthly[month])
        monthly[month] = { date: month, revenue: 0, count: 0 };
      monthly[month].revenue += item.revenue;
      monthly[month].count += item.count;
    }

    return Object.values(monthly).sort((a: any, b: any) =>
      a.date.localeCompare(b.date),
    );
  }
};

export const getNewUsersChart = async (
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'month' = 'day',
) => {
  const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

  const users = await models.User.findAll({
    attributes: [
      [
        Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat),
        'date',
      ],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    group: [
      Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat),
    ],
    order: [
      [
        Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), dateFormat),
        'ASC',
      ],
    ],
    raw: true,
  });

  return users;
};

export const getOrdersByStatus = async (startDate: Date, endDate: Date) => {
  const stats = await models.Order.findAll({
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    group: ['status'],
    raw: true,
  });

  return stats;
};

export const getCategorySales = async (startDate: Date, endDate: Date) => {
  const categorySales = await models.OrderItem.findAll({
    attributes: [
      [Sequelize.col('product.category.name'), 'categoryName'],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`'),
        ),
        'revenue',
      ],
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'itemsSold'],
    ],
    include: [
      {
        model: models.Order,
        as: 'order',
        attributes: [],
        where: getCompletedOrderWhereClause({ startDate, endDate }),
      },
      {
        model: models.Product,
        as: 'product',
        attributes: [],
        include: [
          {
            model: models.Category,
            as: 'category',
            attributes: ['name'],
          },
        ],
      },
    ],
    group: ['product.category.id', 'product.category.name'],
    order: [
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`'),
        ),
        'DESC',
      ],
    ],
    raw: true,
  });

  return categorySales;
};

export const getTopProducts = async (
  startDate: Date,
  endDate: Date,
  limit: number = 5,
) => {
  // 1. Get top selling product IDs
  // We need to filter by Order status and date
  const topItems = await models.OrderItem.findAll({
    attributes: [
      'productId',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal('`OrderItem`.`quantity` * `OrderItem`.`price`'),
        ),
        'revenue',
      ],
    ],
    include: [
      {
        model: models.Order,
        as: 'order',
        attributes: [],
        where: getCompletedOrderWhereClause({ startDate, endDate }),
      },
    ],
    group: ['productId'],
    order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
    limit,
    raw: true,
  });

  // 2. Fetch Product Details
  const productIds = topItems
    .map((item: any) => item.productId)
    .filter((id: number) => id);

  const products = await models.Product.findAll({
    where: { id: { [Op.in]: productIds } },
    attributes: ['id', 'name', 'price'],
    include: [{ model: models.ProductImage, as: 'images' }],
  });

  // 3. Merge Data
  const result = topItems.map((item: any) => {
    const product = products.find((p: any) => p.id === item.productId) as any;
    return {
      productId: item.productId,
      totalSold: item.totalSold,
      revenue: item.revenue,
      name: product ? product.name : 'Unknown Product',
      price: product ? product.price : 0,
      image:
        product && product.images && product.images.length > 0
          ? product.images.find((img: any) => img.is_primary)?.url ||
            product.images[0].url
          : null,
    };
  });

  return result;
};

export const getLowStockProducts = async (threshold: number = 10) => {
  const products = await models.Product.findAll({
    where: {
      stock: { [Op.lt]: threshold },
    },
    attributes: ['id', 'name', 'stock', 'price'],
    order: [['stock', 'ASC']],
    limit: 20,
  });
  return products;
};
