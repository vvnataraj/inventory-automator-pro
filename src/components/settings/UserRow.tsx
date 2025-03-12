
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

  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.roles.length > 0 ? (
            user.roles.map((role, index) => (
              <UserRoleBadge key={index} role={role} />
            ))
          ) : (
            <UserRoleBadge role="No Role" />
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
