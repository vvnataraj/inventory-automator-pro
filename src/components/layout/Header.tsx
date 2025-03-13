import { Bell, LogOut, Menu, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ProgressEntryDialog } from "@/components/progress/ProgressEntryDialog";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const { signOut, user } = useAuth();
  const { isAdmin } = useUserRoles();
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  async function fetchUserProfile() {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      setAvatarUrl(data.avatar_url);
      setUsername(data.username);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  const handleLogout = async () => {
    await signOut();
    // We don't need to manually navigate here as the signOut function already handles it
  };
  
  const getUserInitials = () => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    
    if (!user?.email) return '?';
    
    const namePart = user.email.split('@')[0];
    
    if (namePart.includes('.') || namePart.includes('_')) {
      const parts = namePart.split(/[._]/);
      return parts.map(part => part.charAt(0).toUpperCase()).join('');
    }
    
    return namePart.substring(0, Math.min(2, namePart.length)).toUpperCase();
  };
  
  return (
    <header className="border-b bg-card w-full">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded flex-shrink-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
              alt="STOCKtopus Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
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
            <span className="font-bold text-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">STOCK<span className="text-purple-600">topus</span></span>
            <span className="text-xs text-muted-foreground -mt-1 whitespace-nowrap">Inventory Management</span>
          </div>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsProgressDialogOpen(true)}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Log Progress</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 p-0 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={avatarUrl || ""}
                    alt={user?.email || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username || user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isAdmin() ? 'Administrator' : 'User'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/user-settings" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  User Settings
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ProgressEntryDialog 
        isOpen={isProgressDialogOpen}
        onClose={() => setIsProgressDialogOpen(false)}
      />
    </header>
  );
}
