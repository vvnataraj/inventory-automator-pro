
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AssignAdminRole() {
  const [loading, setLoading] = useState(false);
  
  const assignAdminRole = async () => {
    try {
      setLoading(true);
      
      // First we need to get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', 'macpherson.lucym@gmail.com')
        .single();
      
      if (userError) {
        if (userError.code === 'PGRST116') {
          toast.error('User not found with this email');
        } else {
          throw userError;
        }
        return;
      }
      
      const userId = userData.id;
      
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
        toast.info('User already has admin role');
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
      {loading ? 'Assigning...' : 'Assign Admin Role to macpherson.lucym@gmail.com'}
    </Button>
  );
}
