
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, user, loading, checkPasswordStrength } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
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

  // Check password strength when on signup tab
  useEffect(() => {
    if (activeTab === "signup" && password) {
      const { errors } = checkPasswordStrength(password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, activeTab, checkPasswordStrength]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(email, password);
    setIsLoading(false);
  };

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
          <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-4">
              <img 
                src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
                alt="STOCKtopus Logo" 
                className="h-36 w-36 object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-6xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                STOCK<span className="text-purple-600">topus</span>
              </span>
              <span className="text-2xl text-gray-600">Many hands make light work</span>
            </div>
            <p className="mt-6 text-lg text-gray-700 max-w-md">
              Efficiently manage your inventory, track orders, and analyze sales all in one place. Take control of your business today.
            </p>
          </div>

          {/* Login/Signup Form - Right side */}
          <div className="flex-1 w-full max-w-md">
            <Card className="shadow-xl border-2 border-purple-100 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-100 to-indigo-100">
                <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to your account or create a new one to manage your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs 
                  defaultValue="signin" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg bg-purple-100/50">
                    <TabsTrigger 
                      value="signin"
                      className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm font-medium py-2.5 rounded-lg transition-all"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm font-medium py-2.5 rounded-lg transition-all"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="mt-0 py-4 px-2 bg-white rounded-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Log in to your account</h3>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                          <button 
                            type="button" 
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
                            Signing in...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="mt-0 py-4 px-2 bg-white rounded-md">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Create a new account</h3>
                      <p className="text-sm text-gray-600">Join STOCKtopus to start managing your inventory efficiently</p>
                    </div>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="your.email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${
                            passwordErrors.length > 0 ? "border-red-300" : ""
                          }`}
                        />
                        {passwordErrors.length > 0 && (
                          <div className="mt-2 bg-red-50 border border-red-100 rounded-md p-3">
                            <p className="text-sm font-medium text-red-800">Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-xs text-red-700">
                              {passwordErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {password && passwordErrors.length === 0 && (
                          <p className="text-sm text-green-600 mt-1">✓ Password meets all requirements</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium" 
                        disabled={isLoading || (password.length > 0 && passwordErrors.length > 0)}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
                            Creating account...
                          </span>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
}
