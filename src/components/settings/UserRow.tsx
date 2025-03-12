
import { useState } from "react";
import { toast } from "sonner";
import {
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import UserRoleBadge from "./UserRoleBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
  is_disabled?: boolean;
};

type UserRowProps = {
  user: User;
  onUserUpdated: () => void;
};

export default function UserRow({ user, onUserUpdated }: UserRowProps) {
  const [isDisabled, setIsDisabled] = useState(user.is_disabled || false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    try {
      // In a real application, this would need to be handled by a server function
      // as client-side code doesn't have direct access to modify auth.users
      
      // For demo purposes, we'll just update our local state
      setIsDisabled(!currentStatus);
      
      toast.success(`User ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const assignRole = async (role: string) => {
    try {
      setIsUpdatingRole(true);

      // Check if user already has this role
      if (user.roles.includes(role)) {
        toast.info(`User already has the ${role} role`);
        return;
      }

      // Add the role to the user
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: role
        });

      if (error) throw error;

      toast.success(`Role ${role} assigned successfully`);
      onUserUpdated(); // Refresh the user list to show updated roles
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(`Failed to assign role: ${error.message}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const removeRole = async (role: string) => {
    try {
      setIsUpdatingRole(true);

      // Remove the role from the user
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role ${role} removed successfully`);
      onUserUpdated(); // Refresh the user list to show updated roles
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error(`Failed to remove role: ${error.message}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="truncate max-w-[200px]" title={user.email}>
        {user.email}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 items-center">
          {user.roles.length > 0 ? (
            <>
              {user.roles.map((role, index) => (
                <div key={index} className="flex items-center gap-1">
                  <UserRoleBadge role={role} />
                  <button 
                    onClick={() => removeRole(role)}
                    className="text-xs text-red-500 hover:text-red-700"
                    title={`Remove ${role} role`}
                    disabled={isUpdatingRole}
                  >
                    ×
                  </button>
                </div>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={isUpdatingRole}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['admin', 'manager', 'user'].filter(role => !user.roles.includes(role)).map(role => (
                    <DropdownMenuItem key={role} onClick={() => assignRole(role)}>
                      <span className="capitalize">{role}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <UserRoleBadge role="No Role" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" disabled={isUpdatingRole}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['admin', 'manager', 'user'].map(role => (
                    <DropdownMenuItem key={role} onClick={() => assignRole(role)}>
                      <span className="capitalize">{role}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={!isDisabled}
            onCheckedChange={() => toggleUserStatus(user.id, isDisabled)}
          />
          <span>{isDisabled ? "Disabled" : "Active"}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditUserDialog user={user} onUserUpdated={onUserUpdated} />
          <DeleteUserDialog userId={user.id} userEmail={user.email} onUserDeleted={onUserUpdated} />
        </div>
      </TableCell>
    </TableRow>
  );
}
