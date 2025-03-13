
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RolesManagement from "@/components/settings/RolesManagement";
import { useAuth } from "@/contexts/AuthContext";

export default function RolesTab() {
  const { user } = useAuth();
  
  return (
    <RolesManagement />
  );
}
