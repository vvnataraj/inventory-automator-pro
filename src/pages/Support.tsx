
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Support() {
  const openEmailClient = () => {
    window.location.href = "mailto:support@stocktopus.com";
  };
  
  const callPhoneSupport = () => {
    // Use tel: protocol to trigger the device's phone dialer
    window.location.href = "tel:+18005551234";
    toast.success("Dialing support number...");
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Contact Support</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={callPhoneSupport}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Phone Support
            </CardTitle>
            <CardDescription>Talk to our support team directly</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">+1 (800) 555-1234</p>
            <p className="text-sm text-muted-foreground mt-1">
              Available Monday-Friday, 9am-5pm EST
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={openEmailClient}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>Send us an email anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">support@stocktopus.com</p>
            <p className="text-sm text-muted-foreground mt-1">
              We'll respond within 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with a support agent</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              Start Chat
            </button>
            <p className="text-sm text-muted-foreground mt-2">
              Available 24/7 for urgent issues
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
