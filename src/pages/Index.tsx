import { Box, DollarSign, TrendingUp, BarChart3, Video } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { LeastProfitableItems } from "@/components/dashboard/LeastProfitableItems";
import { RestockAlerts } from "@/components/dashboard/RestockAlerts"; 
import { TheftAlerts } from "@/components/dashboard/TheftAlerts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSales } from "@/hooks/useSales";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PromoVideoScript } from "@/components/marketing/PromoVideoScript";

export default function Index() {
  const navigate = useNavigate();
  const { stats, categoryData } = useDashboardData();
  const { sales } = useSales();
  const [isPromoScriptOpen, setIsPromoScriptOpen] = useState(false);

  const handleCardClick = (link: string | null) => {
    if (link) {
      navigate(link);
    }
  };

  const handlePieChartClick = (data: any, index: number) => {
    if (data && data.name) {
      console.log(`Navigating to inventory with category: ${data.name}`);
      // Navigate to inventory page with category filter applied
      navigate(`/inventory?category=${encodeURIComponent(data.name)}`);
    }
  };

  // Map the icons to the stats
  const iconsMap = {
    "Total Inventory": Box,
    "Low Stock Items": TrendingUp,
    "Monthly Revenue": DollarSign,
    "Active Orders": BarChart3
  };

  // Add icons to stats
  const statsWithIcons = stats.map(stat => ({
    ...stat,
    icon: iconsMap[stat.name as keyof typeof iconsMap]
  }));

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsPromoScriptOpen(true)}>
          <Video className="h-4 w-4" />
          Promo Video Script
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {statsWithIcons.map((stat) => (
          <StatCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            link={stat.link}
            subValue={stat.subValue}
            tooltipContent={stat.tooltipContent}
            onClick={handleCardClick}
          />
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <div className="lg:col-span-3">
          <CategoryPieChart 
            data={categoryData} 
            onSliceClick={handlePieChartClick} 
            className="h-full"
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RestockAlerts sales={sales} className="flex-1" />
          <TheftAlerts className="flex-1" />
        </div>
        <div className="lg:col-span-2">
          <RecentActivities className="h-full" />
        </div>
      </div>
      
      <div className="mt-6">
        <LeastProfitableItems />
      </div>

      <Dialog open={isPromoScriptOpen} onOpenChange={setIsPromoScriptOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Promotional Video Script</DialogTitle>
          </DialogHeader>
          <PromoVideoScript />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
