
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkPasswordStrength } from "@/utils/passwordUtils";

/**
 * Hook providing authentication operations
 */
export const useAuthOperations = (
  setNeedsPasswordChange: (value: boolean) => void
) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetches user profile data directly from auth.users
   */
  const fetchUserProfile = async (user: User) => {
    try {
      console.log("Fetching user profile for:", user.id);
      
      // The username and avatar_url should already be in the user object
      // from the Supabase SDK since we're using the direct column
      
      // If for some reason they aren't populated, ensure they're at least null
      if (user.username === undefined) {
        user.username = null;
      }
      
      if (user.avatar_url === undefined) {
        user.avatar_url = null;
      }
      
      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return user;
    }
  };

  /**
   * Signs in a user with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Signing in user:", email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // If sign-in was successful, fetch and merge profile data
      if (data.user) {
        try {
          await fetchUserProfile(data.user);
        } catch (profileFetchError) {
          console.error("Error fetching profile after sign in:", profileFetchError);
        }
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs up a new user with email and password
   */
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Attempting to sign out user");
      
      // First check if we have a session before trying to sign out
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("No active session found, redirecting to login");
        // No active session, just redirect to login
        navigate("/login");
        toast.info("You've been signed out");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast.error(error.message);
        
        // If we get a 401 or auth related error, the session is likely already invalid
        // So we should still redirect to login
        if (error.message.includes("Auth") || error.message.includes("session")) {
          navigate("/login");
          return;
        }
        
        return;
      }
      
      // Always navigate to login page after successful signout
      navigate("/login");
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      
      // Even if there's an error, redirect to login
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a password reset email
   */
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

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    fetchUserProfile
  };
};
