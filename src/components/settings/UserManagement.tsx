
import { useState, useEffect, useCallback } from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import AddUserDialog from "./AddUserDialog";
import UserTable from "./UserTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ListControls } from "@/components/common/ListControls";

type User = {
  id: string;
  email: string;
  username: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
  is_disabled?: boolean;
};

type UserManagementProps = {
  initialUsers: User[];
  loading: boolean;
  onRefresh: () => void;
};

export default function UserManagement({ initialUsers, loading, onRefresh }: UserManagementProps) {
  const { isAdmin } = useUserRoles();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Update users when initialUsers prop changes, with safeguards
  useEffect(() => {
    // Only update if initialUsers actually changes and is an array
    if (Array.isArray(initialUsers) && initialUsers.length > 0) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);
  
  // Memoize the filter function to prevent recomputation on each render
  const getFilteredUsers = useCallback(() => {
    if (!searchTerm) return users;
    const searchLower = searchTerm.toLowerCase();
    
    return users.filter(user => (
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      user.roles.some(role => role.toLowerCase().includes(searchLower))
    ));
  }, [users, searchTerm]);
  
  // Compute filtered users only when needed
  const filteredUsers = getFilteredUsers();
  
  if (!isAdmin()) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-muted-foreground">You need admin privileges to access this section.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-muted-foreground">
            {users.length} {users.length === 1 ? 'user' : 'users'} in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddUserDialog onUserAdded={onRefresh} />
        </div>
      </div>
      
      <ListControls
        searchPlaceholder="Search users..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        showFilter={false}
      />
      
      {loading ? (
        <div className="py-8 text-center">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Loading users...</p>
        </div>
      ) : (
        <UserTable 
          users={filteredUsers} 
          loading={loading} 
          onUserUpdated={onRefresh} 
        />
      )}
    </div>
  );
}
