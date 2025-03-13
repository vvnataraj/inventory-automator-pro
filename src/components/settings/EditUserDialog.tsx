
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";

type Role = 'admin' | 'manager' | 'user';

type User = {
  id: string;
  email: string;
  roles: string[];
};

type EditUserDialogProps = {
  user: User;
  onUserUpdated: () => void;
};

export default function EditUserDialog({ user, onUserUpdated }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Get the primary role (first in the array) or default to "user"
  const [editUserRole, setEditUserRole] = useState<Role>((user.roles[0] as Role) || "user");
  const { isAdmin } = useUserRoles();
  
  async function updateUserRole() {
    if (!isAdmin()) {
      toast.error("Only admins can change user roles");
      return;
    }

    try {
      setLoading(true);
      
      // Delete all existing roles for this user first
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;
      
      // Add the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: editUserRole });
      
      if (insertError) throw insertError;
      
      toast.success("User role updated successfully");
      onUserUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAdmin()) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Update role for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-role" className="text-sm font-medium">Role</label>
            <Select value={editUserRole} onValueChange={(value) => setEditUserRole(value as Role)}>
              <SelectTrigger id="edit-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (Full Access)</SelectItem>
                <SelectItem value="manager">Manager (No Settings Access)</SelectItem>
                <SelectItem value="user">User (Read-Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Admin:</strong> Full access to all features and settings</p>
            <p><strong>Manager:</strong> Can add/edit/delete items but cannot access settings</p>
            <p><strong>User:</strong> Read-only access, cannot add/edit/delete</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={updateUserRole} disabled={loading}>
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
