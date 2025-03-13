
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCard } from "./profile/ProfileCard";
import { useEffect, useState } from "react";

export default function ProfileTab() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      // Ensure we have the latest user data including username
      console.log("ProfileTab - User data from AuthContext:", {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url
      });
      setUserData(user);
    }
  }, [user]);
  
  console.log("ProfileTab - userData being passed to ProfileCard:", userData ? {
    id: userData.id,
    email: userData.email,
    username: userData.username,
    avatar_url: userData.avatar_url
  } : "null");
  
  return <ProfileCard user={userData} />;
}
