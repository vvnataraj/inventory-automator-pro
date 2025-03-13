
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigation, adminItems, helpItems, sections } from "./sidebar/navigationItems";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarSection } from "./sidebar/SidebarSection";
import { CollapseButton } from "./sidebar/CollapseButton";

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ collapsed, toggleCollapse }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Admin: false,
    Help: false
  });
  
  const location = window.location;
  
  // Check if current location is in admin section
  const isAdminActive = adminItems.some(item => item.href === location.pathname);
  
  // Check if current location is in help section
  const isHelpActive = helpItems.some(item => item.href === location.pathname);
  
  // Update open sections when location changes
  useEffect(() => {
    if (isAdminActive && !openSections.Admin) {
      setOpenSections(prev => ({ ...prev, Admin: true }));
    }
    
    if (isHelpActive && !openSections.Help) {
      setOpenSections(prev => ({ ...prev, Help: true }));
    }
  }, [location.pathname, isAdminActive, isHelpActive, openSections]);

  const handleSectionToggle = (section: string, state: boolean) => {
    setOpenSections(prev => ({ ...prev, [section]: state }));
  };

  return (
    <div className={cn(
      "flex h-full flex-col border-r transition-all duration-300",
      "bg-white dark:bg-gray-900 dark:border-gray-800",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="flex items-center px-4 py-2 justify-end">
        <CollapseButton collapsed={collapsed} toggleCollapse={toggleCollapse} />
      </div>
      
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {/* Main navigation items */}
        {navigation.map((item) => (
          <SidebarNavItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
            active={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
        
        {/* Collapsible sections */}
        {sections.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            icon={section.icon}
            items={section.items}
            isOpen={openSections[section.title]}
            isActive={section.title === "Admin" ? isAdminActive : isHelpActive}
            collapsed={collapsed}
            onOpenChange={(open) => handleSectionToggle(section.title, open)}
          />
        ))}
      </nav>
    </div>
  );
}
