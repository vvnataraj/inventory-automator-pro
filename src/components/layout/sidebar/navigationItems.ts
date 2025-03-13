
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
  LifeBuoy,
  Headphones,
  GraduationCap,
  FileText,
} from "lucide-react";

// Main navigation items
export const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Purchases", href: "/purchases", icon: Truck },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Sales", href: "/sales", icon: CircleDollarSign },
];

// Admin section items
export const adminItems = [
  { name: "Progress", href: "/progress", icon: Clock },
  { name: "Locations", href: "/locations", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

// Help section items
export const helpItems = [
  { name: "Contact Support", href: "/support", icon: Headphones },
  { name: "Training", href: "/training", icon: GraduationCap },
  { name: "Documentation", href: "/documentation", icon: FileText },
];

// Section configurations
export const sections = [
  { 
    title: "Admin", 
    icon: Shield, 
    items: adminItems 
  },
  { 
    title: "Help", 
    icon: LifeBuoy, 
    items: helpItems 
  }
];
