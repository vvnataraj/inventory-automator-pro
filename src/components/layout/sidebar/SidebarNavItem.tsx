
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
}

export function SidebarNavItem({ name, href, icon: Icon, active, collapsed }: SidebarNavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-gray-800"
      )}
      title={collapsed ? name : undefined}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span>{name}</span>}
    </Link>
  );
}
