
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Inventory from "@/pages/Inventory";
import Orders from "@/pages/Orders";
import Purchases from "@/pages/Purchases";
import Locations from "@/pages/Locations";
import Sales from "@/pages/Sales";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import UserSettings from "@/pages/UserSettings";
import AccountManagement from "@/pages/AccountManagement";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Support from "@/pages/Support";
import Training from "@/pages/Training";
import Documentation from "@/pages/Documentation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="stocktopus-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/purchases" 
                element={
                  <ProtectedRoute>
                    <Purchases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/locations" 
                element={
                  <ProtectedRoute>
                    <Locations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales" 
                element={
                  <ProtectedRoute>
                    <Sales />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-settings" 
                element={
                  <ProtectedRoute>
                    <UserSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account-management" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AccountManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Help Section Routes */}
              <Route 
                path="/support" 
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/training" 
                element={
                  <ProtectedRoute>
                    <Training />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documentation" 
                element={
                  <ProtectedRoute>
                    <Documentation />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
