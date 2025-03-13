
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

// Static data for analytics
const staticTotalRevenue = 5432.78;
const staticAvgOrderValue = 108.66;
const staticCompletedSales = 42;
const staticUniqueCustomers = 31;
const staticGrowthRate = 12.5;

// Static chart data
const staticDailySalesData = [
  { date: "07/12", revenue: 650.50, count: 5 },
  { date: "07/13", revenue: 820.75, count: 7 },
  { date: "07/14", revenue: 432.25, count: 4 },
  { date: "07/15", revenue: 975.00, count: 8 },
  { date: "07/16", revenue: 756.50, count: 6 },
  { date: "07/17", revenue: 1250.25, count: 10 },
  { date: "07/18", revenue: 875.50, count: 7 }
];

const staticMonthlySalesData = [
  { month: "Feb 2024", revenue: 3250.75, count: 28 },
  { month: "Mar 2024", revenue: 4150.50, count: 35 },
  { month: "Apr 2024", revenue: 3875.25, count: 32 },
  { month: "May 2024", revenue: 4325.00, count: 36 },
  { month: "Jun 2024", revenue: 4850.50, count: 42 },
  { month: "Jul 2024", revenue: 5432.78, count: 45 }
];

const staticStatusData = [
  { status: "completed", count: 42 },
  { status: "pending", count: 4 },
  { status: "cancelled", count: 2 },
  { status: "refunded", count: 2 }
];

const staticPaymentMethodData = [
  { name: "Credit Card", value: 28 },
  { name: "Cash", value: 10 },
  { name: "Mobile Payment", value: 8 },
  { name: "Debit Card", value: 4 }
];

const staticItemsPerSaleData = [
  { itemCount: 1, saleCount: 12 },
  { itemCount: 2, saleCount: 16 },
  { itemCount: 3, saleCount: 10 },
  { itemCount: 4, saleCount: 7 },
  { itemCount: 5, saleCount: 5 }
];

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ sales }) => {
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
            <div className="text-2xl font-bold">${staticTotalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${staticAvgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticCompletedSales}</div>
            <p className="text-xs text-muted-foreground">Out of {staticCompletedSales + 8} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticUniqueCustomers}</div>
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
            <div className={`text-2xl font-bold ${staticGrowthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {staticGrowthRate >= 0 ? '+' : ''}{staticGrowthRate.toFixed(2)}%
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
                data={staticDailySalesData}
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
                data={staticMonthlySalesData}
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
                  data={staticPaymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {staticPaymentMethodData.map((entry, index) => (
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
                data={staticStatusData}
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
                data={staticItemsPerSaleData}
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
