
import React from "react";
import { Sale } from "@/types/sale";
import { SummaryMetrics } from "@/components/analytics/metrics/SummaryMetrics";
import { DailySalesChart } from "@/components/analytics/charts/DailySalesChart";
import { SalesByStatusChart } from "@/components/analytics/charts/SalesByStatusChart";
import { PaymentMethodsChart } from "@/components/analytics/charts/PaymentMethodsChart";

interface SalesAnalyticsProps {
  sales: Sale[];
}

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ sales }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <SummaryMetrics sales={sales} />
      <DailySalesChart sales={sales} />
      <SalesByStatusChart sales={sales} />
      <PaymentMethodsChart sales={sales} />
    </div>
  );
};
