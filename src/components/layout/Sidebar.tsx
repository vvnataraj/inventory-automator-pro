
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
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  Headphones,
  GraduationCap,
  FileText,
  ChevronDown,
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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

// Help section items
const helpItems = [
  { name: "Contact Support", href: "/support", icon: Headphones },
  { name: "Training", href: "/training", icon: GraduationCap },
  { name: "Documentation", href: "/documentation", icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ collapsed, toggleCollapse }: SidebarProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = window.location;
  
  // Check if current location is in admin section
  const isAdminActive = adminItems.some(item => item.href === location.pathname);
  
  // Check if current location is in help section
  const isHelpActive = helpItems.some(item => item.href === location.pathname);
  
  // Automatically open admin section if on an admin page
  useEffect(() => {
    if (isAdminActive && !isAdminOpen) {
      setIsAdminOpen(true);
    }
  }, [location.pathname, isAdminActive, isAdminOpen]);

  // Automatically open help section if on a help page
  useEffect(() => {
    if (isHelpActive && !isHelpOpen) {
      setIsHelpOpen(true);
    }
  }, [location.pathname, isHelpActive, isHelpOpen]);

  return (
    <div className={cn(
      "flex h-full flex-col bg-white border-r transition-all duration-300",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="flex h-16 items-center px-4 border-b justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse} 
          className="flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
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
            title={collapsed ? item.name : undefined}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
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
            title={collapsed ? "Admin" : undefined}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Admin</span>}
            </div>
            {!collapsed && (isAdminOpen || isAdminActive ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("mt-1 space-y-1", collapsed ? "pl-1" : "pl-4")}>
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
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Help section with collapsible content */}
        <Collapsible 
          open={isHelpOpen || isHelpActive} 
          onOpenChange={setIsHelpOpen} 
          className="mt-4"
        >
          <CollapsibleTrigger 
            className={cn(
              "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isHelpActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={collapsed ? "Help" : undefined}
          >
            <div className="flex items-center gap-3">
              <LifeBuoy className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Help</span>}
            </div>
            {!collapsed && (isHelpOpen || isHelpActive ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("mt-1 space-y-1", collapsed ? "pl-1" : "pl-4")}>
            {helpItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
}
