
import { Bell, LogOut, Menu, Search, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Header() {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out successfully");
  };
  
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search inventory..."
                className="w-96 bg-muted pl-8 pr-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  alt="Avatar"
                  className="rounded-full"
                  src="/lovable-uploads/349248b6-96b7-485d-98af-8d8bfaca1b38.png"
                  style={{ aspectRatio: "32/32", objectFit: "cover", mixBlendMode: 'multiply' }}
                  onError={(e) => {
                    e.currentTarget.src = "https://avatar.vercel.sh/inventory";
                  }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
