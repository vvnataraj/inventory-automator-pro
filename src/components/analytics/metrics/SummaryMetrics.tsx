
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, ReceiptText, Users } from "lucide-react";
import { Sale } from "@/types/sale";

interface SummaryMetricsProps {
  sales: Sale[];
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ sales }) => {
  // Calculate total revenue
  const totalRevenue = sales.reduce((total, sale) => total + sale.total, 0);
  
  // Calculate average order value
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  
  // Count completed sales
  const completedSales = sales.filter(sale => sale.status === "completed").length;

  // Calculate unique customers
  const uniqueCustomers = new Set(sales.map(sale => sale.customerName)).size;

  return (
    <>
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
    </>
  );
};
