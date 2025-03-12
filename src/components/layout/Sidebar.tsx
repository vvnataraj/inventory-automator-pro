import { useState, useEffect } from "react";
import {
  Home,
  Package,
  MapPin,
  CircleDollarSign,
  ShoppingCart,
  ClipboardList,
  Settings,
  BarChart,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const Sidebar = ({ isMobile, setIsMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [user, setUser] = useState({
    name: "John Doe",
    imageUrl: "https://github.com/shadcn.png",
  });

  useEffect(() => {
    if (auth?.user) {
      setUser({
        name: auth.user.name || "User",
        imageUrl: auth.user.image || "",
      });
    }
  }, [auth?.user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Sales", href: "/sales", icon: CircleDollarSign },
    { name: "Purchases", href: "/purchases", icon: ShoppingCart },
    { name: "Orders", href: "/orders", icon: ClipboardList },
    { name: "Analytics", href: "/analytics", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="flex flex-col h-full bg-gray-100 border-r py-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="px-6 mb-8">
        <Link to="/" className="flex items-center text-lg font-semibold">
          <Avatar className="mr-2">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {user.name}
        </Link>
      </div>

      <div className="flex-grow px-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${
              location.pathname === item.href
                ? "bg-gray-200 dark:bg-gray-800"
                : "text-gray-700 dark:text-gray-400"
            }`}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="px-6 mt-8">
        <Button
          variant="ghost"
          className="w-full justify-start dark:hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Mobile navigation */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="pl-6 pt-6">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through your dashboard.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow px-1 mt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${
                    location.pathname === item.href
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-400"
                  }`}
                  onClick={() => setIsMobile(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="px-6 mt-8">
              <Button
                variant="ghost"
                className="w-full justify-start dark:hover:bg-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
};
