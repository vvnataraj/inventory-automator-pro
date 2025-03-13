
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users } from "lucide-react";

export default function Training() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Training Resources</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Learn at your own pace</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-600 hover:underline cursor-pointer">
                Getting Started Guide
              </li>
              <li className="flex items-center text-blue-600 hover:underline cursor-pointer">
                Inventory Management Basics
              </li>
              <li className="flex items-center text-blue-600 hover:underline cursor-pointer">
                Advanced Reporting Features
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Webinars
            </CardTitle>
            <CardDescription>Join interactive training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <p className="font-medium">New User Orientation</p>
                <p className="text-sm text-muted-foreground">Every Monday at 2pm EST</p>
              </li>
              <li>
                <p className="font-medium">Advanced Features Workshop</p>
                <p className="text-sm text-muted-foreground">Every Wednesday at 1pm EST</p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Comprehensive guides and articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                Browse Knowledge Base
              </button>
              <p className="text-sm text-muted-foreground">
                Over 200 articles covering all aspects of the system
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
