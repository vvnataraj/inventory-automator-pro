
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
  readOnly?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireManager = false,
  readOnly = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { isAdmin, isManager, isReadOnly, loading: rolesLoading } = useUserRoles();
  const location = useLocation();

  // Don't render anything while checking authentication or roles
  if (loading || rolesLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for admin access if required
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" state={{ 
      from: location,
      error: "You need admin privileges to access this page" 
    }} replace />;
  }

  // Check for manager access if required
  if (requireManager && !isManager()) {
    return <Navigate to="/" state={{ 
      from: location,
      error: "You need manager privileges to access this page" 
    }} replace />;
  }

  // Check for read-only access
  if (readOnly === false && isReadOnly()) {
    return <Navigate to="/" state={{ 
      from: location,
      error: "You don't have permission to access this functionality" 
    }} replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}
