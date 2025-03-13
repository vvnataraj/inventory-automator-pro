
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { useSales } from "@/hooks/useSales";
import { TopProfitableItems } from "@/components/dashboard/TopProfitableItems";

export default function Analytics() {
  const { sales } = useSales(1, 1000, ""); // Get all sales for analytics

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
      </div>
      
      <SalesAnalytics sales={sales} />
      
      <div className="mt-6">
        <TopProfitableItems />
      </div>
    </MainLayout>
  );
}
