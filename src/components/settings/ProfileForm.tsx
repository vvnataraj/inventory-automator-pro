
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { EmailField } from "./EmailField";
import { UsernameField } from "./UsernameField";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";

export function ProfileForm() {
  const { user, username, setUsername, loading, updateProfile } = useUserProfile();
  
  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    
    try {
      await updateProfile();
    } catch (error) {
      console.error("ProfileForm: Error updating profile:", error);
      toast.error("Failed to save profile changes. Please try again.");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your profile details and public information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EmailField email={user?.email} />
        
        <UsernameField 
          username={username} 
          onChange={setUsername} 
        />

        <Separator className="my-6" />
        
        <ThemeSelector />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
