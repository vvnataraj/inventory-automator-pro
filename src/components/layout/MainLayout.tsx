
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar isMobile={isMobile} setIsMobile={setIsMobile} />
      </div>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
