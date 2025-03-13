
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function AssignAdminRole() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const assignAdminRole = async () => {
    if (!user) {
      toast.error("You need to be logged in");
      return;
    }
    
    try {
      setLoading(true);
      
      // Use the current user's ID directly instead of looking it up by email
      const userId = user.id;
      
      console.log("Current user ID:", userId);
      
      // Check if the admin role already exists for this user
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (checkError) throw checkError;
      
      // If admin role doesn't exist, add it
      if (!existingRole || existingRole.length === 0) {
        // First remove any existing roles for this user
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
          
        if (deleteError) throw deleteError;
        
        // Then add the admin role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (insertError) throw insertError;
        
        toast.success('Admin role assigned successfully!');
      } else {
        toast.info('You already have the admin role');
      }
    } catch (error) {
      console.error("Error assigning admin role:", error);
      toast.error('Failed to assign admin role');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={assignAdminRole}
      disabled={loading}
      variant="destructive"
    >
      {loading ? 'Assigning...' : 'Make Yourself Admin'}
    </Button>
  );
}
