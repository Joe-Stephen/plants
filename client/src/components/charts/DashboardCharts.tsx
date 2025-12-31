import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export const RevenueChart = ({ data }: { data: any[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="date"
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          formatter={(value: any) => [`₹${value}`, 'Revenue']}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B', // Amber
  PAID: '#3B82F6', // Blue
  SHIPPED: '#8B5CF6', // Violet
  DELIVERED: '#10B981', // Emerald
  CANCELLED: '#EF4444', // Red
};

export const OrderStatusChart = ({ data }: { data: any[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="count"
          nameKey="status"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={STATUS_COLORS[entry.status] || '#9CA3AF'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const NewUsersChart = ({ data }: { data: any[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis stroke="#666" fontSize={12} allowDecimals={false} />
        <Tooltip cursor={{ fill: '#f3f4f6' }} />
        <Bar
          dataKey="count"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          name="New Users"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const TopProductsChart = ({ data }: { data: any[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
          stroke="#eee"
        />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          width={100}
          fontSize={11}
          tickFormatter={(val) =>
            val.length > 15 ? val.slice(0, 15) + '...' : val
          }
        />
        <Tooltip cursor={{ fill: '#f3f4f6' }} />
        <Bar
          dataKey="totalSold"
          fill="#8b5cf6"
          radius={[0, 4, 4, 0]}
          name="Units Sold"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const CategorySalesChart = ({ data }: { data: any[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
        <XAxis dataKey="categoryName" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip
          cursor={{ fill: '#f3f4f6' }}
          formatter={(value: any) => [`₹${value}`, 'Revenue']}
        />
        <Bar
          dataKey="revenue"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
          name="Sales"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
