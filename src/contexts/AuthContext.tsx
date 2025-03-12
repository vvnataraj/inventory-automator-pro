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
  assignAllUsersAdminRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const assignUserRole = async (email: string, role: 'admin' | 'manager' | 'user'): Promise<boolean> => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();
      
      if (userError || !userData) {
        let userId = null;
        
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, username');
        
        const matchingProfile = allProfiles?.find(
          p => p.username && p.username.toLowerCase() === email.toLowerCase()
        );
        
        if (matchingProfile) {
          userId = matchingProfile.id;
        } else {
          toast.error(`User with email ${email} not found`);
          return false;
        }
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });
        
        if (roleError) {
          console.error("Error assigning role:", roleError);
          toast.error(`Failed to assign ${role} role to ${email}`);
          return false;
        }
      } else {
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

  const assignAllUsersAdminRole = async (): Promise<void> => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');
      
      if (profilesError) {
        toast.error(`Error fetching profiles: ${profilesError.message}`);
        return;
      }
      
      if (!profiles || profiles.length === 0) {
        toast.info("No users found to assign admin role to.");
        return;
      }
      
      let successCount = 0;
      let failCount = 0;
      
      for (const profile of profiles) {
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', profile.id)
          .eq('role', 'admin')
          .single();
        
        if (existingRole) {
          successCount++;
          continue;
        }
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: profile.id,
            role: 'admin'
          });
        
        if (roleError) {
          console.error(`Error assigning admin role to user ${profile.username}:`, roleError);
          failCount++;
        } else {
          successCount++;
        }
      }
      
      if (failCount === 0) {
        toast.success(`Successfully assigned admin role to all ${successCount} users.`);
      } else {
        toast.info(`Operation completed: ${successCount} successes, ${failCount} failures.`);
      }
    } catch (error) {
      console.error("Error in assignAllUsersAdminRole:", error);
      toast.error(`Error assigning admin roles: ${error.message}`);
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
      
      if (data && data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: data.user.id, 
            role: 'user' 
          });
        
        if (roleError) {
          console.error("Error assigning user role:", roleError);
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
      assignUserRole,
      assignAllUsersAdminRole
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
