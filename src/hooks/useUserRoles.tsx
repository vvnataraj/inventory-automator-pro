
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Role = 'admin' | 'manager' | 'user';

export function useUserRoles() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user has a specific role
  const hasRole = useCallback((checkRole: Role) => role === checkRole, [role]);
  
  // Check if user is admin
  const isAdmin = useCallback(() => role === 'admin', [role]);
  
  // Check if user is manager or admin (managers and admins both have elevated permissions)
  const isManager = useCallback(() => {
    console.log("Current role:", role); // Add logging to debug
    return role === 'manager' || role === 'admin';
  }, [role]);
  
  // Check if user is a regular user with read-only access
  // A user with the 'user' role should NOT be considered read-only
  const isReadOnly = useCallback(() => role === null, [role]);
  
  // Fetch user role with memoization to prevent recreation on each render
  const fetchRoles = useCallback(async () => {
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
      
      console.log("Raw user roles data:", data); // Log the raw data
      
      // Get the first role or default to 'user' instead of null
      // This ensures authenticated users without explicit roles get 'user' role by default
      const userRole = data && data.length > 0 ? data[0].role as Role : 'user';
      console.log("Fetched role:", userRole);
      setRole(userRole);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast.error("Failed to load user permissions: " + error.message);
      // Still set a default 'user' role on error to prevent access issues
      setRole('user');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Set a role for the current user (replacing any existing role)
  const setUserRole = useCallback(async (newRole: Role) => {
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
  }, [user, fetchRoles]);
  
  // Only fetch roles when user changes, not on every render
  useEffect(() => {
    fetchRoles();
  }, [user?.id, fetchRoles]); // Add fetchRoles to dependencies
  
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
