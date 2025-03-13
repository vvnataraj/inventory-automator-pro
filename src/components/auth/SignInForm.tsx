
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Log in to your account</h3>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <button 
              type="button" 
              onClick={() => setForgotPasswordOpen(true)}
              className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  );
};
