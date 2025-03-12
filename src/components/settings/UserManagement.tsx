
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
import { Pencil, Trash, UserPlus } from "lucide-react";

type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
};

type Role = 'admin' | 'manager' | 'user';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
      checkIsAdmin();
      fetchUsers();
    }
  }, [currentUser]);

  async function checkIsAdmin() {
    try {
      const { data, error } = await supabase
        .rpc('is_admin');
      
      if (error) throw error;
      setIsAdmin(data);
      
      if (!data) {
        toast.error("You don't have admin privileges to manage users");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast.error("Failed to check admin privileges");
    }
  }

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
      
      // We need to use the admin API - this won't work with the client
      // Instead, we'll create a user and then assign the role
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
      
      // 2. Assign the role
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
      // Let's just remove all their roles and set a flag in their profile
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
  
  async function makeCurrentUserAdmin() {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: currentUser.id, role: 'admin' });
      
      if (error) throw error;
      
      toast.success("You now have admin privileges");
      checkIsAdmin();
    } catch (error) {
      console.error("Error adding admin role:", error);
      toast.error("Failed to add admin role");
    } finally {
      setLoading(false);
    }
  }
  
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Management</h3>
        <p>You need admin privileges to access this section.</p>
        <Button onClick={makeCurrentUserAdmin}>Make Yourself Admin</Button>
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
            <TableHead>Last Login</TableHead>
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
                      }>
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No Role</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString() 
                  : "Never"
                }
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
