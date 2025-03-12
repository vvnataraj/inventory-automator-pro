
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, ShoppingCart, ReceiptText, Users } from "lucide-react";
import { Sale } from "@/types/sale";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, isAfter, parseISO } from "date-fns";

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

  // Prepare data for daily sales chart
  const dailySalesData = getDailySalesData(sales);

  // Prepare data for status distribution
  const statusData = getStatusDistribution(sales);

  // Prepare data for payment methods
  const paymentMethodData = getPaymentMethodDistribution(sales);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Daily Sales (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailySalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sales By Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
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
