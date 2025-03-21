
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type SlackMessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SlackMessageDialog({ isOpen, onClose }: SlackMessageDialogProps) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      // Use the Supabase Edge Function to send the message to Slack
      const response = await fetch("/api/send-slack-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sender: name || "Anonymous User",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response data:", data);
        setErrorDetails(JSON.stringify(data, null, 2));
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent to Slack successfully!");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message to Slack:", error);
      
      // Display a more detailed error message
      toast.error(`Failed to send message to Slack: ${error.message}`);
      
      if (!errorDetails) {
        setErrorDetails(`Error: ${error.message}\nTime: ${new Date().toLocaleString()}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to Slack</DialogTitle>
          <DialogDescription>
            Send a message to the Phocas Software Slack channel
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
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          {errorDetails && (
            <div className="grid gap-2">
              <Label htmlFor="error-details" className="text-destructive">Error Details</Label>
              <Textarea
                id="error-details"
                value={errorDetails}
                readOnly
                className="min-h-[100px] bg-destructive/10 border-destructive/20 text-xs font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Please share these details with your administrator if the problem persists.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
