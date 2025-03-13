
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Role = 'admin' | 'manager' | 'user';

export function useUserRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user has a specific role
  const hasRole = (role: Role) => roles.includes(role);
  
  // Check if user is admin
  const isAdmin = () => hasRole('admin');
  
  // Check if user is manager or admin (managers and admins both have elevated permissions)
  const isManager = () => hasRole('manager') || hasRole('admin');
  
  // Check if user is a regular user with read-only access
  const isReadOnly = () => roles.length === 0 || (roles.length === 1 && hasRole('user'));
  
  // Fetch user roles
  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      console.log("Fetching roles for user ID:", user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching user roles:", error);
        throw error;
      }
      
      const userRoles = data ? data.map(r => r.role as Role) : [];
      console.log("Fetched roles:", userRoles);
      setRoles(userRoles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast.error("Failed to load user permissions: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a role to the current user
  const addRole = async (role: Role) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      // Check if role already exists
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', role);
      
      if (checkError) {
        console.error("Error checking existing role:", checkError);
        throw checkError;
      }
      
      // If role doesn't exist, add it
      if (!existingRole || existingRole.length === 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role });
        
        if (insertError) {
          console.error("Error adding role:", insertError);
          throw insertError;
        }
        
        await fetchRoles();
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Failed to add role: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a role from the current user
  const removeRole = async (role: Role) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .eq('role', role);
      
      if (error) {
        console.error("Error removing role:", error);
        throw error;
      }
      
      await fetchRoles();
      return true;
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("Failed to remove role: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRoles();
  }, [user]);
  
  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isManager,
    isReadOnly,
    fetchRoles,
    addRole,
    removeRole
  };
}
