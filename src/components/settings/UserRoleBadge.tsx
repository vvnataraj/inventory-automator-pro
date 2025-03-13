
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserRoleBadgeProps = {
  role: string;
};

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case 'manager':
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      case 'user':
        return <Shield className="h-4 w-4 mr-1" />;
      default:
        return <Shield className="h-4 w-4 mr-1" />;
    }
  };

  const getBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'secondary';
      case 'user':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getBadgeVariant(role)} className="flex items-center">
      {getRoleIcon(role)}
      {role}
    </Badge>
  );
}
