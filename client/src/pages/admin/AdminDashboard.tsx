import { useState } from 'react';
import {
  useGetSalesChartQuery,
  useGetOrdersByStatusQuery,
  useGetNewUsersChartQuery,
  useGetTopProductsQuery,
  useGetCategorySalesQuery,
  useGetDashboardStatsQuery,
} from '../../features/analytics/analyticsApi';
import { useGetAllOrdersQuery } from '../../features/orders/orderApi';
import { exportToCSV } from '../../utils/exportUtils';
import LowStockAlert from '../../components/dashboard/LowStockAlert';
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  Download,
  RefreshCw,
  Users,
  Package,
  Loader2,
} from 'lucide-react';
import {
  RevenueChart,
  OrderStatusChart,
  NewUsersChart,
  TopProductsChart,
  CategorySalesChart,
} from '../../components/charts/DashboardCharts';
// ... imports

const AdminDashboard = () => {
  // Date Range State
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
    period: string;
  }>({
    startDate: '',
    endDate: '',
    period: '30d',
  });

  // Auto Refresh State
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value;
    if (period === 'custom') {
      setDateRange({ ...dateRange, period });
      return;
    }

    const end = new Date();
    const start = new Date();

    if (period === '7d') {
      start.setDate(end.getDate() - 7);
    } else if (period === '30d') {
      start.setDate(end.getDate() - 30);
    } else if (period === 'thisMonth') {
      start.setDate(1);
    }

    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      period,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
      period: 'custom',
    });
  };

  const filter = {
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  };

  const pollingInterval = isAutoRefresh ? 30000 : 0;
  const refetchOptions = {
    refetchOnMountOrArgChange: true,
    pollingInterval,
  };

  const { isLoading: isLoadingOrders } = useGetAllOrdersQuery(
    { page: 1 },
    refetchOptions,
  );
  const { data: salesData, isLoading: isLoadingSales } = useGetSalesChartQuery(
    filter,
    refetchOptions,
  );
  const { data: statusData, isLoading: isLoadingStatus } =
    useGetOrdersByStatusQuery(filter, refetchOptions);
  const { data: newUsersData, isLoading: isLoadingUsers } =
    useGetNewUsersChartQuery(filter, refetchOptions);
  const { data: topProductsData, isLoading: isLoadingTop } =
    useGetTopProductsQuery(filter, refetchOptions);
  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategorySalesQuery(filter, refetchOptions);
  const { data: dashboardStats, isLoading: isLoadingStats } =
    useGetDashboardStatsQuery(filter, refetchOptions);

  const isLoading =
    isLoadingOrders ||
    isLoadingSales ||
    isLoadingStatus ||
    isLoadingUsers ||
    isLoadingTop ||
    isLoadingCategory ||
    isLoadingStats;

  const handleExport = () => {
    if (salesData) {
      exportToCSV(salesData, `sales_report_${dateRange.period}`);
    }
  };

  // KPIs from API
  const totalRevenue = Number(dashboardStats?.totalRevenue) || 0;
  const totalOrders = Number(dashboardStats?.totalOrders) || 0;
  const totalProducts = Number(dashboardStats?.totalProducts) || 0;
  const totalUsers = Number(dashboardStats?.totalUsers) || 0;

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">Welcome back to your store overview</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download size={18} />
            Export Report
          </button>

          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isAutoRefresh
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <RefreshCw
              size={18}
              className={isAutoRefresh ? 'animate-spin' : ''}
            />
            {isAutoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </button>

          {/* Date Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 px-2 text-gray-500">
              <Calendar size={18} />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <select
              value={dateRange.period}
              onChange={handleRangeChange}
              className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-1.5 border"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange.period === 'custom' && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-1.5 border"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-1.5 border"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <LowStockAlert />

      {isLoading && (
        <div className="p-10 text-center">
          <Loader2 className="animate-spin inline text-green-600" size={32} />
        </div>
      )}

      {!isLoading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((card, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 transition-transform hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {card.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Revenue Over Time
              </h3>
              <RevenueChart data={salesData || []} />
            </div>

            {/* Order Status Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Orders by Status
              </h3>
              <OrderStatusChart data={statusData || []} />
            </div>

            {/* New Users Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                New Users Over Time
              </h3>
              <NewUsersChart data={newUsersData || []} />
            </div>

            {/* Top Products Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Top Selling Products
              </h3>
              <TopProductsChart data={topProductsData || []} />
            </div>

            {/* Category Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border col-span-1 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Sales by Category
              </h3>
              <CategorySalesChart data={categoryData || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
