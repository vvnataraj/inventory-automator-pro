
import { Sale } from "@/types/sale";
import { format, subDays, isAfter, parseISO } from "date-fns";

// Colors for charts
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

// Get daily sales data for charts
export const getDailySalesData = (sales: Sale[]) => {
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

// Get status distribution data
export const getStatusDistribution = (sales: Sale[]) => {
  const statusCounts: Record<string, number> = {};
  
  sales.forEach(sale => {
    statusCounts[sale.status] = (statusCounts[sale.status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
};

// Get payment method distribution data
export const getPaymentMethodDistribution = (sales: Sale[]) => {
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

// Custom label for pie chart
export const renderCustomizedPieChartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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
