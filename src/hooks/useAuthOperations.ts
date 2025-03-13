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
      console.log("User object received:", {
        id: user.id,
        email: user.email,
        username: user.username !== undefined ? user.username : "undefined",
        user_metadata: user.user_metadata,
        avatar_url: user.avatar_url !== undefined ? user.avatar_url : "undefined"
      });
      
      // First, try to fetch the user profile data directly from the profiles view
      // This will give us access to the username column from auth.users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
      } else if (profileData) {
        console.log("Profile data fetched from database:", profileData);
        
        // Update the user object with the data from the profiles view
        user.username = profileData.username;
        user.avatar_url = profileData.avatar_url;
        
        console.log("User object updated with profile data:", {
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url
        });
      } else {
        console.log("No profile data found in database");
      }
      
      // Fallback to user_metadata if we still don't have a username
      // This ensures backward compatibility
      if (!user.username && user.user_metadata && user.user_metadata.username) {
        console.log("Found username in user_metadata:", user.user_metadata.username);
        user.username = user.user_metadata.username;
      } else {
        console.log("No username found in user_metadata or it's already set from profile data");
      }
      
      // Same for avatar_url
      if (!user.avatar_url && user.user_metadata && user.user_metadata.avatar_url) {
        console.log("Found avatar_url in user_metadata:", user.user_metadata.avatar_url);
        user.avatar_url = user.user_metadata.avatar_url;
      }
      
      // If for some reason they aren't populated, ensure they're at least null
      if (user.username === undefined) {
        console.log("Username was undefined, setting to null");
        user.username = null;
      }
      
      if (user.avatar_url === undefined) {
        console.log("Avatar URL was undefined, setting to null");
        user.avatar_url = null;
      }
      
      console.log("Returning user object:", {
        id: user.id,
        email: user.email,
        username: user.username,
        user_metadata: user.user_metadata,
        avatar_url: user.avatar_url
      });
      
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
