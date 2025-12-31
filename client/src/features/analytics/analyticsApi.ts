import { api } from '../../services/api';

interface AnalyticsData {
  [key: string]: string | number;
}

interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  period?: string;
}

const getQueryString = (filter: AnalyticsFilter | void) => {
  if (!filter) return '';
  const params = new URLSearchParams();
  if (filter.startDate) params.append('startDate', filter.startDate);
  if (filter.endDate) params.append('endDate', filter.endDate);
  if (filter.period) params.append('period', filter.period);
  return `?${params.toString()}`;
};

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalesChart: builder.query<AnalyticsData[], AnalyticsFilter | void>({
      query: (filter) => `/analytics/sales-chart${getQueryString(filter)}`,
      transformResponse: (response: { data: AnalyticsData[] }) => response.data,
      keepUnusedDataFor: 300,
    }),
    getOrdersByStatus: builder.query<AnalyticsData[], AnalyticsFilter | void>({
      query: (filter) => `/analytics/orders-by-status${getQueryString(filter)}`,
      transformResponse: (response: { data: { stats: AnalyticsData[] } }) =>
        response.data.stats,
      keepUnusedDataFor: 300,
    }),
    getNewUsersChart: builder.query<AnalyticsData[], AnalyticsFilter | void>({
      query: (filter) => `/analytics/new-users-chart${getQueryString(filter)}`,
      transformResponse: (response: { data: AnalyticsData[] }) => response.data,
      keepUnusedDataFor: 300,
    }),
    getTopProducts: builder.query<AnalyticsData[], AnalyticsFilter | void>({
      query: (filter) => `/analytics/top-products${getQueryString(filter)}`,
      transformResponse: (response: { data: { products: AnalyticsData[] } }) =>
        response.data.products,
      keepUnusedDataFor: 300,
    }),
    getCategorySales: builder.query<AnalyticsData[], AnalyticsFilter | void>({
      query: (filter) => `/analytics/category-sales${getQueryString(filter)}`,
      transformResponse: (response: { data: { sales: AnalyticsData[] } }) =>
        response.data.sales,
      keepUnusedDataFor: 300,
    }),
    getLowStock: builder.query<any[], number | void>({
      query: (threshold = 10) => `/analytics/low-stock?threshold=${threshold}`,
      transformResponse: (response: { data: { products: any[] } }) =>
        response.data.products,
      keepUnusedDataFor: 300,
    }),
    getDashboardStats: builder.query<AnalyticsData, AnalyticsFilter | void>({
      query: (filter) => `/analytics/dashboard${getQueryString(filter)}`,
      transformResponse: (response: { data: AnalyticsData }) => response.data,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetSalesChartQuery,
  useGetOrdersByStatusQuery,
  useGetNewUsersChartQuery,
  useGetTopProductsQuery,
  useGetCategorySalesQuery,
  useGetLowStockQuery,
  useGetDashboardStatsQuery,
} = analyticsApi;
