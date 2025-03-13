import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Box, DollarSign, TrendingUp } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { inventoryItems } from "@/data/inventoryData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const getInitialStats = () => [
  {
    name: "Total Inventory",
    value: "Loading...",
    change: "+4.75%",
    icon: Box,
    link: "/inventory"
  },
  {
    name: "Low Stock Items",
    value: "23",
    change: "-12%",
    icon: TrendingUp,
    link: null
  },
  {
    name: "Monthly Revenue",
    value: "$45,231",
    change: "+20.1%",
    icon: DollarSign,
    link: null
  },
  {
    name: "Active Orders",
    value: "56",
    change: "+8%",
    icon: BarChart3,
    link: null
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getInitialStats());
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const calculateTotalInventoryValue = () => {
      const totalValue = inventoryItems.reduce((sum, item) => {
        const itemValue = (item.rrp || item.price || 0) * item.stock;
        return sum + itemValue;
      }, 0);
      
      const formattedValue = `$${totalValue.toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })}`;
      
      setStats(prevStats => prevStats.map(stat => 
        stat.name === "Total Inventory" 
          ? { ...stat, value: formattedValue } 
          : stat
      ));
    };

    const calculateCategoryValues = () => {
      const categoryValues = inventoryItems.reduce((acc, item) => {
        const category = item.category;
        const itemValue = (item.rrp || item.price || 0) * item.stock;
        
        acc[category] = (acc[category] || 0) + itemValue;
        return acc;
      }, {} as Record<string, number>);

      const data = Object.entries(categoryValues).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }));

      setCategoryData(data);
    };

    calculateTotalInventoryValue();
    calculateCategoryValues();
  }, []);

  const handleCardClick = (link: string | null) => {
    if (link) {
      navigate(link);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {stats.map((stat) => (
          <Card 
            key={stat.name} 
            className={`animate-fade-in ${stat.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            onClick={() => handleCardClick(stat.link)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-sm p-3 rounded-lg bg-muted/50"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">New order received</p>
                    <p className="text-muted-foreground">
                      Order #{Math.floor(Math.random() * 1000000)}
                    </p>
                  </div>
                  <time className="text-muted-foreground">2m ago</time>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
