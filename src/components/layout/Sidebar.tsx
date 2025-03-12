
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Building2,
  CircleDollarSign,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Truck,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Purchases", href: "/purchases", icon: Truck },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Locations", href: "/locations", icon: Building2 },
  { name: "Sales", href: "/sales", icon: CircleDollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-white border-r">
      <div className="flex h-16 items-center gap-2 px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-primary/10">
            <Box className="h-4 w-4 m-1.5 text-primary" />
          </div>
          <span className="font-semibold">Inventory Pro</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
