
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Role = 'admin' | 'manager' | 'user';

export function useUserRoles() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user has a specific role
  const hasRole = (checkRole: Role) => role === checkRole;
  
  // Check if user is admin
  const isAdmin = () => role === 'admin';
  
  // Check if user is manager or admin (managers and admins both have elevated permissions)
  const isManager = () => role === 'manager' || role === 'admin';
  
  // Check if user is a regular user with read-only access
  const isReadOnly = () => role === null || role === 'user';
  
  // Fetch user role
  const fetchRoles = async () => {
    if (!user) {
      setRole(null);
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
      
      // Get the first role or default to null
      const userRole = data && data.length > 0 ? data[0].role as Role : null;
      console.log("Fetched role:", userRole);
      setRole(userRole);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast.error("Failed to load user permissions: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Set a role for the current user (replacing any existing role)
  const setUserRole = async (newRole: Role) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      // Delete all existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.error("Error removing existing roles:", deleteError);
        throw deleteError;
      }
      
      // Add the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: newRole });
      
      if (insertError) {
        console.error("Error adding role:", insertError);
        throw insertError;
      }
      
      await fetchRoles();
      return true;
    } catch (error) {
      console.error("Error setting role:", error);
      toast.error("Failed to set role: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRoles();
  }, [user]);
  
  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isManager,
    isReadOnly,
    fetchRoles,
    setUserRole
  };
}
