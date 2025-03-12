
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
  assignUserRole: (email: string, role: 'admin' | 'manager' | 'user') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Utility function to assign a role to a user by email
  const assignUserRole = async (email: string, role: 'admin' | 'manager' | 'user'): Promise<boolean> => {
    try {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();
      
      if (userError || !userData) {
        // Try to fetch directly from auth users
        const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (authError || !authData.user) {
          toast.error(`User with email ${email} not found`);
          return false;
        }
        
        // Add user role with the user ID from auth
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: role
          });
        
        if (roleError) {
          console.error("Error assigning role:", roleError);
          toast.error(`Failed to assign ${role} role to ${email}`);
          return false;
        }
      } else {
        // Add user role with the user ID from profiles
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userData.id,
            role: role
          });
        
        if (roleError) {
          console.error("Error assigning role:", roleError);
          toast.error(`Failed to assign ${role} role to ${email}`);
          return false;
        }
      }
      
      toast.success(`Role ${role} assigned to ${email} successfully`);
      return true;
    } catch (error) {
      console.error("Error in assignUserRole:", error);
      toast.error(`Error assigning role: ${error.message}`);
      return false;
    }
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
      
      navigate("/");
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // If sign-up is successful and we have a user, assign the "user" role
      if (data && data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: data.user.id, 
            role: 'user' 
          });
        
        if (roleError) {
          console.error("Error assigning user role:", roleError);
          // We don't want to show this error to the user as their account was created
          // but the role assignment failed - it can be fixed later.
        }
      }
      
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate("/login");
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Immediately try to assign admin role to johnson.lucym@gmail.com when the provider is mounted
  useEffect(() => {
    if (!loading && user) {
      const targetEmail = "johnson.lucym@gmail.com";
      assignUserRole(targetEmail, 'admin');
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      assignUserRole 
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
