
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "./AuthContextTypes";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { checkPasswordStrength } from "@/utils/passwordUtils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const navigate = useNavigate();
  
  // Initialize auth operations
  const authOperations = useAuthOperations(setNeedsPasswordChange);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        console.log("AuthContext - Initial session user data:", {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
          app_metadata: session.user.app_metadata
        });
        
        // Fetch user data from the auth.users table to get the profile fields
        const fetchUserData = async () => {
          try {
            const updatedUser = await authOperations.fetchUserProfile(session.user);
            console.log("AuthContext - Initial user fetch:", {
              id: updatedUser.id,
              email: updatedUser.email,
              username: updatedUser.username,
              user_metadata: updatedUser.user_metadata,
              avatar_url: updatedUser.avatar_url
            });
            setUser(updatedUser);
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };
        
        fetchUserData();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          console.log("AuthContext - Auth state change - Session user data:", {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata
          });
          
          try {
            const updatedUser = await authOperations.fetchUserProfile(session.user);
            console.log("AuthContext - Auth state change:", {
              id: updatedUser.id,
              email: updatedUser.email,
              username: updatedUser.username,
              user_metadata: updatedUser.user_metadata,
              avatar_url: updatedUser.avatar_url
            });
            setUser(updatedUser);
          } catch (error) {
            console.error("Error fetching user data on auth change:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading: loading || authOperations.loading, 
      signIn: authOperations.signIn, 
      signUp: authOperations.signUp, 
      signOut: authOperations.signOut, 
      resetPassword: authOperations.resetPassword,
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
