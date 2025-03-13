
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarSectionProps {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
  isOpen: boolean;
  isActive: boolean;
  collapsed: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function SidebarSection({ 
  title, 
  icon: Icon, 
  items, 
  isOpen, 
  isActive, 
  collapsed, 
  onOpenChange,
  className 
}: SidebarSectionProps) {
  const location = window.location;
  
  return (
    <Collapsible 
      open={isOpen || isActive} 
      onOpenChange={onOpenChange} 
      className={cn("mt-4", className)}
    >
      <CollapsibleTrigger 
        className={cn(
          "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary dark:bg-primary/20"
            : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-gray-800"
        )}
        title={collapsed ? title : undefined}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && (isOpen || isActive ? 
          <ChevronDown className="h-4 w-4" /> : 
          <ChevronRight className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className={cn("mt-1 space-y-1", collapsed ? "pl-1" : "pl-4")}>
        {items.map((item) => (
          <SidebarNavItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
            active={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
