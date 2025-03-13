
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
import { useUserRoles } from "@/hooks/useUserRoles";

type User = {
  id: string;
  email: string;
  username: string | null;
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
  const { isAdmin } = useUserRoles();

  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    if (!isAdmin()) {
      toast.error("Only admins can change user status");
      return;
    }

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

  // Format user display info
  const displayEmail = user.email || "No email";
  const displayUsername = user.username || "—";
  
  // Get the primary role (first in the array) or default to 'user'
  const primaryRole = user.roles.length > 0 ? user.roles[0] : 'user';

  // Display a shorter version of the ID
  const shortId = user.id.substring(0, 8);

  return (
    <TableRow>
      <TableCell>
        <span className="text-xs font-mono" title={user.id}>{shortId}...</span>
      </TableCell>
      <TableCell>
        <span className="font-medium">{displayEmail}</span>
      </TableCell>
      <TableCell>
        {displayUsername}
      </TableCell>
      <TableCell>
        <UserRoleBadge role={primaryRole} />
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={!isDisabled}
            onCheckedChange={() => toggleUserStatus(user.id, isDisabled)}
            disabled={!isAdmin()}
          />
          <span>{isDisabled ? "Disabled" : "Active"}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {isAdmin() && (
          <div className="flex justify-end gap-2">
            <EditUserDialog user={user} onUserUpdated={onUserUpdated} />
            <DeleteUserDialog userId={user.id} userEmail={displayEmail} onUserDeleted={onUserUpdated} />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
