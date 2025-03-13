
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, ShoppingCart, ReceiptText, Users, Calendar } from "lucide-react";
import { Sale } from "@/types/sale";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from "recharts";
import { format, subDays, isAfter, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface SalesAnalyticsProps {
  sales: Sale[];
}

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ sales }) => {
  // Calculate total revenue
  const totalRevenue = sales.reduce((total, sale) => total + sale.total, 0);
  
  // Calculate average order value
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  
  // Count completed sales
  const completedSales = sales.filter(sale => sale.status === "completed").length;

  // Calculate unique customers
  const uniqueCustomers = new Set(sales.map(sale => sale.customerName)).size;

  // Get sales from last 7 days
  const last7Days = sales.filter(sale => 
    isAfter(parseISO(sale.date), subDays(new Date(), 7))
  );

  // Calculate growth rate (comparing last 7 days with previous 7 days)
  const last7DaysTotal = last7Days.reduce((sum, sale) => sum + sale.total, 0);
  const previous7Days = sales.filter(sale => 
    isAfter(parseISO(sale.date), subDays(new Date(), 14)) && 
    !isAfter(parseISO(sale.date), subDays(new Date(), 7))
  );
  const previous7DaysTotal = previous7Days.reduce((sum, sale) => sum + sale.total, 0);
  const growthRate = previous7DaysTotal > 0 
    ? ((last7DaysTotal - previous7DaysTotal) / previous7DaysTotal) * 100 
    : 100;

  // Prepare data for various charts
  const dailySalesData = getDailySalesData(sales);
  const statusData = getStatusDistribution(sales);
  const paymentMethodData = getPaymentMethodDistribution(sales);
  const monthlySalesData = getMonthlySalesData(sales);
  const itemsPerSaleData = getItemsPerSaleDistribution(sales);
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSales}</div>
            <p className="text-xs text-muted-foreground">Out of {sales.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Across all sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weekly Growth Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(2)}%
            </div>
            <div className="ml-2 text-xs text-muted-foreground">
              Compared to previous week
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Sales (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailySalesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue ($)" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="count" 
                  name="Number of Sales" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlySalesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Number of Sales" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} sales`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sales By Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Items Per Sale Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={itemsPerSaleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="itemCount" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="saleCount" name="Number of Sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const getDailySalesData = (sales: Sale[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, 'MM/dd'),
      fullDate: date,
      revenue: 0,
      count: 0
    };
  });

  sales.forEach(sale => {
    const saleDate = parseISO(sale.date);
    const dayIndex = last7Days.findIndex(day => 
      format(day.fullDate, 'yyyy-MM-dd') === format(saleDate, 'yyyy-MM-dd')
    );
    
    if (dayIndex !== -1) {
      last7Days[dayIndex].revenue += sale.total;
      last7Days[dayIndex].count += 1;
    }
  });

  return last7Days.map(({ date, revenue, count }) => ({ date, revenue, count }));
};

const getStatusDistribution = (sales: Sale[]) => {
  const statusCounts: Record<string, number> = {};
  
  sales.forEach(sale => {
    statusCounts[sale.status] = (statusCounts[sale.status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
};

const getPaymentMethodDistribution = (sales: Sale[]) => {
  const paymentMethods: Record<string, number> = {};
  
  sales.forEach(sale => {
    const method = sale.paymentMethod || 'Unknown';
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });
  
  return Object.entries(paymentMethods).map(([name, value]) => ({
    name,
    value
  }));
};

const getMonthlySalesData = (sales: Sale[]) => {
  const monthlyData: Record<string, { revenue: number; count: number }> = {};
  
  // Initialize with last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = format(date, 'MMM yyyy');
    monthlyData[monthKey] = { revenue: 0, count: 0 };
  }
  
  // Populate with sales data
  sales.forEach(sale => {
    const saleDate = parseISO(sale.date);
    const monthKey = format(saleDate, 'MMM yyyy');
    
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].revenue += sale.total;
      monthlyData[monthKey].count += 1;
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    count: data.count
  }));
};

const getItemsPerSaleDistribution = (sales: Sale[]) => {
  const itemCounts: Record<number, number> = {};
  
  sales.forEach(sale => {
    const itemCount = sale.items.length;
    itemCounts[itemCount] = (itemCounts[itemCount] || 0) + 1;
  });
  
  return Object.entries(itemCounts)
    .map(([itemCount, saleCount]) => ({
      itemCount: Number(itemCount),
      saleCount
    }))
    .sort((a, b) => a.itemCount - b.itemCount);
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
