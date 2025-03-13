
import { useAuth } from "@/contexts/AuthContext";
import { ProfileCard } from "./profile/ProfileCard";

export default function ProfileTab() {
  const { user } = useAuth();
  
  return <ProfileCard user={user} />;
}
