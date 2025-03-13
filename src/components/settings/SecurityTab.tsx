
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";

export default function SecurityTab() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { checkPasswordStrength, needsPasswordChange, setNeedsPasswordChange } = useAuth();
  
  // Check password as user types
  useEffect(() => {
    if (newPassword) {
      const { isStrong, errors } = checkPasswordStrength(newPassword);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [newPassword, checkPasswordStrength]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    const { isStrong, errors } = checkPasswordStrength(newPassword);
    if (!isStrong) {
      toast.error(`Password doesn't meet the security requirements: ${errors.join(", ")}`);
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
      
      // Clear the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Reset the forced password change flag if it was set
      if (needsPasswordChange) {
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
        {needsPasswordChange && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Password update required</p>
              <p className="text-sm text-yellow-700">Your current password doesn't meet our security requirements. Please update it now.</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={passwordErrors.length > 0 ? "border-red-300" : ""}
            />
            {passwordErrors.length > 0 && (
              <div className="text-sm text-red-500 mt-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {newPassword && passwordErrors.length === 0 && (
              <p className="text-sm text-green-600 mt-1">✓ Password meets all requirements</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={confirmPassword && newPassword !== confirmPassword ? "border-red-300" : ""}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-sm text-green-600 mt-1">✓ Passwords match</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !newPassword || !confirmPassword || passwordErrors.length > 0 || newPassword !== confirmPassword}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
