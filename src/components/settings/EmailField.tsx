
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  email: string | undefined;
}

export function EmailField({ email }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" value={email} disabled />
      <p className="text-xs text-muted-foreground">
        Email cannot be changed
      </p>
    </div>
  );
}
