
import { Box, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { LeastProfitableItems } from "@/components/dashboard/LeastProfitableItems";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Index() {
  const navigate = useNavigate();
  const { stats, categoryData } = useDashboardData();

  const handleCardClick = (link: string | null) => {
    if (link) {
      navigate(link);
    }
  };

  const handlePieChartClick = (data: any, index: number) => {
    if (data && data.name) {
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
        <CategoryPieChart 
          data={categoryData} 
          onSliceClick={handlePieChartClick} 
        />
        <RecentActivities />
      </div>
      
      <div className="mt-6">
        <LeastProfitableItems />
      </div>
    </MainLayout>
  );
}
