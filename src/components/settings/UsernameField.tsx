
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UsernameFieldProps {
  username: string;
  onChange: (value: string) => void;
}

export function UsernameField({ username, onChange }: UsernameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input 
        id="username" 
        value={username}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a username"
      />
    </div>
  );
}
