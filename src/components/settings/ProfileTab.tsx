
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCard } from "./profile/ProfileCard";
import { useEffect, useState } from "react";

export default function ProfileTab() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      // Ensure we have the latest user data including username
      console.log("ProfileTab - User data:", user);
      setUserData(user);
    }
  }, [user]);
  
  return <ProfileCard user={userData} />;
}
