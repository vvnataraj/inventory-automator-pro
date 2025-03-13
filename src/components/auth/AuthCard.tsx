
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export const AuthCard = () => {
  const [activeTab, setActiveTab] = useState("signin");
  
  return (
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
              <SignInForm />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0 py-4 px-2 bg-white rounded-md">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
