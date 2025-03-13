import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkPasswordStrength: (password: string) => {
    isStrong: boolean;
    errors: string[];
  };
  needsPasswordChange: boolean;
  setNeedsPasswordChange: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Function to check password strength
  const checkPasswordStrength = (password: string) => {
    const errors: string[] = [];
    
    // Check minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    // Check for numbers
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    // Check for special characters
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      isStrong: errors.length === 0,
      errors
    };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // Check password strength after successful login
      const { isStrong } = checkPasswordStrength(password);
      if (!isStrong) {
        setNeedsPasswordChange(true);
        toast.warning("Your password doesn't meet the security requirements. Please update it.");
        navigate("/user-settings");
      } else {
        navigate("/");
        toast.success("Successfully signed in!");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Check password strength before signing up
      const { isStrong, errors } = checkPasswordStrength(password);
      
      if (!isStrong) {
        toast.error(`Password doesn't meet the security requirements: ${errors.join(", ")}`);
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      setLoading(true); // Add loading state while signing out
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      // Explicitly clear the session and user state
      setSession(null);
      setUser(null);
      
      // Always navigate to login page after successful signout
      navigate("/login");
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/user-settings`,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      checkPasswordStrength,
      needsPasswordChange,
      setNeedsPasswordChange
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
