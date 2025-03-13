
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoginBranding } from "@/components/auth/LoginBranding";
import { AuthCard } from "@/components/auth/AuthCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Check if redirected from another page
  useEffect(() => {
    // Check if we were redirected with an error message
    const state = location.state as { error?: string };
    if (state?.error) {
      // You could show this error in the UI if needed
      console.error("Auth redirect error:", state.error);
    }
    
    // Add debug logging
    console.log("Login page loading state:", loading);
    console.log("User state:", user ? "Logged in" : "Not logged in");
    
    // Set a timeout to detect if loading takes too long
    const timeout = setTimeout(() => {
      if (loading) {
        setDebugMessage("Loading is taking longer than expected. There might be an issue with authentication.");
        console.warn("Auth loading state has been active for more than 5 seconds");
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [location, loading, user]);

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/" />;
  }

  // Don't render content until we know the auth state for sure
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        {debugMessage && (
          <div className="text-red-500 max-w-md text-center px-4 py-2 bg-red-50 rounded-md">
            {debugMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Logo Section - Left side */}
          <LoginBranding />

          {/* Login/Signup Form - Right side */}
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
