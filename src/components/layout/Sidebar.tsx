
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Building2,
  CircleDollarSign,
  Clock,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Truck,
  Shield,
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Main navigation items
const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Purchases", href: "/purchases", icon: Truck },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Sales", href: "/sales", icon: CircleDollarSign },
];

// Admin section items
const adminItems = [
  { name: "Progress", href: "/progress", icon: Clock },
  { name: "Locations", href: "/locations", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const location = window.location;
  
  // Check if current location is in admin section
  const isAdminActive = adminItems.some(item => item.href === location.pathname);

  return (
    <div className="flex h-full flex-col bg-white border-r">
      <div className="flex h-16 items-center gap-2 px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded flex items-center justify-center">
            <img 
              src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
              alt="STOCKtopus Logo" 
              className="h-10 w-10 object-contain"
              style={{ mixBlendMode: 'multiply' }}
              onError={(e) => {
                // Fallback to SVG logo if image fails to load
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      class="text-primary"
                    >
                      <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
                      <path d="M9.5 8.5C9.5 8.5 9.5 9 10 9C10.5 9 10.5 8.5 10.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M13.5 8.5C13.5 8.5 13.5 9 14 9C14.5 9 14.5 8.5 14.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 11C10.8333 11.6667 13.2 12.4 14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 14C6 15.5 4.5 17 3.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9 15C8.5 17.5 7.5 19.5 5.5 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M12 16C12 18.5 12 20.5 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M15 15C15.5 17.5 16.5 19.5 18.5 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M16 14C18 15.5 19.5 17 20.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7 14C5.5 15 4.5 15 2.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M17 14C18.5 15 19.5 15 21.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 13C8.5 10.5 6.5 9.5 3 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  `;
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">STOCK<span className="text-purple-600">topus</span></span>
            <span className="text-xs text-muted-foreground -mt-1">Inventory Management</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {/* Main navigation items */}
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
        
        {/* Admin section with collapsible content */}
        <Collapsible 
          open={isAdminOpen || isAdminActive} 
          onOpenChange={setIsAdminOpen} 
          className="mt-4"
        >
          <CollapsibleTrigger 
            className={cn(
              "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isAdminActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </div>
            {isAdminOpen || isAdminActive ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {adminItems.map((item) => (
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
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
}
