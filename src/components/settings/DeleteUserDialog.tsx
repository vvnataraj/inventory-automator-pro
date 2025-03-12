
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type DeleteUserDialogProps = {
  userId: string;
  userEmail: string;
  onUserDeleted: () => void;
};

export default function DeleteUserDialog({ userId, userEmail, onUserDeleted }: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);

  async function deleteUser() {
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
      onUserDeleted();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove user roles");
    } finally {
      setLoading(false);
    }
  }
  
  return (
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
            Are you sure you want to delete the user "{userEmail}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={deleteUser}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
