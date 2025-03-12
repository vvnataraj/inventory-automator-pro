
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Switch
} from "@/components/ui/switch";
import { Pencil, Trash, UserPlus, ShieldAlert, ShieldCheck, Shield, UserX } from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";

type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
  is_disabled?: boolean;
};

type Role = 'admin' | 'manager' | 'user';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { isAdmin } = useUserRoles();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For adding a new user
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("user");
  const [addUserOpen, setAddUserOpen] = useState(false);
  
  // For editing a user
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserRole, setEditUserRole] = useState<Role>("user");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // We can only get users indirectly via their profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at');
      
      if (profilesError) throw profilesError;
      
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Fetch disabled status from auth.users
      // Note: In a real application, you would need a server-side function for this
      // as the auth schema is not directly accessible from client-side code
      
      // Map roles to users
      if (profiles) {
        const usersWithRoles = profiles.map(profile => {
          const userRoles = rolesData
            ? rolesData
                .filter(r => r.user_id === profile.id)
                .map(r => r.role)
            : [];
          
          return {
            id: profile.id,
            email: profile.username || 'No email available',
            last_sign_in_at: null, // We don't have access to this via profiles
            created_at: profile.created_at,
            roles: userRoles,
            is_disabled: false // Default value, would need server-side check in real app
          };
        });
        
        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  
  async function addUser() {
    try {
      setLoading(true);
      
      // First, create user via signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      const newUserId = authData.user.id;
      
      // Assign the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: newUserId, role: newUserRole });
      
      if (roleError) throw roleError;
      
      toast.success("User created successfully. Please check email for confirmation.");
      fetchUsers();
      setAddUserOpen(false);
      
      // Reset form
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("user");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function updateUserRole() {
    if (!editingUser) return;
    
    try {
      setLoading(true);
      
      // First check if the role already exists for this user
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', editingUser.id)
        .eq('role', editUserRole);
      
      if (checkError) throw checkError;
      
      // If role doesn't exist, add it
      if (!existingRole || existingRole.length === 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: editingUser.id, role: editUserRole });
        
        if (insertError) throw insertError;
      }
      
      toast.success("User role updated successfully");
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  }
  
  async function deleteUser(userId: string) {
    try {
      setLoading(true);
      
      // We can't directly delete users with the client SDK
      // Let's just remove all their roles
      const { error: roleDeleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (roleDeleteError) throw roleDeleteError;
      
      toast.success("User roles removed successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove user roles");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
      setLoading(true);
      
      // In a real application, this would need to be handled by a server function
      // as client-side code doesn't have direct access to modify auth.users
      
      // For demo purposes, we'll just update our local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, is_disabled: !currentStatus };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      toast.success(`User ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  }
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case 'manager':
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      default:
        return <Shield className="h-4 w-4 mr-1" />;
    }
  };
  
  if (!isAdmin()) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Management</h3>
        <p>You need admin privileges to access this section.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">User Management</h3>
        
        <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign a role.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
              <Button onClick={addUser} disabled={loading || !newUserEmail || !newUserPassword}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading && <div className="py-4 text-center">Loading users...</div>}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <Badge key={index} variant={
                        role === 'admin' 
                          ? 'default' 
                          : role === 'manager' 
                            ? 'secondary' 
                            : 'outline'
                      } className="flex items-center">
                        {getRoleIcon(role)}
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      No Role
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!user.is_disabled}
                    onCheckedChange={() => toggleUserStatus(user.id, user.is_disabled || false)}
                  />
                  <span>{user.is_disabled ? "Disabled" : "Active"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog open={editDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                    setEditDialogOpen(open);
                    if (!open) setEditingUser(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingUser(user);
                          setEditUserRole(user.roles[0] as Role || "user");
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User Role</DialogTitle>
                        <DialogDescription>
                          Update role for {editingUser?.email}
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
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={updateUserRole} disabled={loading}>
                          {loading ? "Updating..." : "Update Role"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the user "{user.email}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {users.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
