
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
   * Fetches user profile data from the profiles view
   */
  const fetchUserProfile = async (user: User) => {
    try {
      // Use the profiles view which maps to auth.users
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Merge profile data with user object
      if (data) {
        user.username = data.username;
        user.avatar_url = data.avatar_url;
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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
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
