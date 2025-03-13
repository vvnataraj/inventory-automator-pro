
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ProgressEntryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProgressEntryDialog({ isOpen, onClose }: ProgressEntryDialogProps) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleLogProgress = async () => {
    if (!description.trim()) {
      toast.error("Please enter progress details");
      return;
    }

    setIsLoading(true);
    
    try {
      // Insert the progress entry into Supabase
      const { error } = await supabase
        .from('progress_entries')
        .insert({
          description,
          sender: name || "Anonymous User",
          user_id: user?.id || "anonymous",
        });
      
      if (error) throw error;

      toast.success("Progress logged successfully!");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error logging progress:", error);
      toast.error(`Failed to log progress: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
          <DialogDescription>
            Enter details about your progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name (optional)</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Progress Details</Label>
            <Textarea
              id="description"
              placeholder="Describe what progress you've made..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleLogProgress} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Progress"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
