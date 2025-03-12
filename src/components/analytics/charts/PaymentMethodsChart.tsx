
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Sale } from "@/types/sale";
import { getPaymentMethodDistribution, renderCustomizedPieChartLabel, CHART_COLORS } from "@/utils/analyticsUtils";

interface PaymentMethodsChartProps {
  sales: Sale[];
}

export const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ sales }) => {
  // Prepare data for payment methods
  const paymentMethodData = getPaymentMethodDistribution(sales);

  // Custom label component that uses the output from renderCustomizedPieChartLabel
  const CustomLabel = (props: any) => {
    const labelProps = renderCustomizedPieChartLabel(props);
    
    return (
      <text 
        x={labelProps.x}
        y={labelProps.y}
        fill={labelProps.fill}
        textAnchor={labelProps.textAnchor}
        dominantBaseline={labelProps.dominantBaseline}
        fontSize={labelProps.fontSize}
      >
        {labelProps.content}
      </text>
    );
  };

  return (
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
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
