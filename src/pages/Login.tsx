
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoginBranding } from "@/components/auth/LoginBranding";
import { AuthCard } from "@/components/auth/AuthCard";

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if redirected from another page
  useEffect(() => {
    // Check if we were redirected with an error message
    const state = location.state as { error?: string };
    if (state?.error) {
      // You could show this error in the UI if needed
      console.error("Auth redirect error:", state.error);
    }
  }, [location]);

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/" />;
  }

  // Don't render content until we know the auth state for sure
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
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
