
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";
import { AvatarManager } from "./AvatarManager";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { useNavigate } from "react-router-dom";

type ProfileCardProps = {
  user: any | null;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      console.log("Setting initial profile data:", { username: user.username, avatarUrl: user.avatar_url });
      setUsername(user.username || "");
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-muted-foreground">You need to be logged in to view your profile</p>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your profile details and public information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileForm 
          user={user}
          username={username}
          setUsername={setUsername}
          loading={loading}
          setLoading={setLoading}
          avatarUrl={avatarUrl}
        />
        
        <Separator className="my-6" />
        
        <AvatarManager
          user={user}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          username={username}
        />

        <Separator className="my-6" />
        
        <ThemeSelector />
      </CardContent>
    </Card>
  );
}
