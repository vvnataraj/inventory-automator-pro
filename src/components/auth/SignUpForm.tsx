
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, checkPasswordStrength } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Check password strength when on signup tab
  useEffect(() => {
    if (password) {
      const { errors } = checkPasswordStrength(password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, checkPasswordStrength]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(email, password);
    setIsLoading(false);
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Create a new account</h3>
        <p className="text-sm text-gray-600">Join STOCKtopus to start managing your inventory efficiently</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
          <Input 
            id="signup-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${
              passwordErrors.length > 0 ? "border-red-300" : ""
            }`}
          />
          {passwordErrors.length > 0 && (
            <div className="mt-2 bg-red-50 border border-red-100 rounded-md p-3">
              <p className="text-sm font-medium text-red-800">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-xs text-red-700">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {password && passwordErrors.length === 0 && (
            <p className="text-sm text-green-600 mt-1">✓ Password meets all requirements</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium" 
          disabled={isLoading || (password.length > 0 && passwordErrors.length > 0)}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
              Creating account...
            </span>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </>
  );
};
