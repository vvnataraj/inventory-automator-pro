
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
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              {/* Octopus head */}
              <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
              {/* Eyes */}
              <circle cx="10" cy="9" r="1" fill="currentColor" />
              <circle cx="14" cy="9" r="1" fill="currentColor" />
              {/* Tentacle arms */}
              <path d="M8 14C6 16 4 17 3 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 15C8 18 7 20 5 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 16C12 19 12 21 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 15C16 18 17 20 19 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 14C18 16 20 17 21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 14C5 15 4 15 2 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M17 14C19 15 20 15 22 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 13C8 10 6 9 2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold">STOCKtopus</span>
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
