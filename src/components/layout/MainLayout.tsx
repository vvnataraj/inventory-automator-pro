
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Check for user preference in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);
  
  // Save preference when changed
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col transition-all duration-300 ${collapsed ? 'w-[70px]' : 'w-64'}`}>
          <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
        </div>
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
