
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users, X, Calendar, CalendarPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Training() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [showWebinarSignup, setShowWebinarSignup] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<string>("");
  
  const openVideo = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
  };
  
  const closeVideo = () => {
    setVideoUrl(null);
  };

  const openWebinarSignup = (webinarTitle: string) => {
    setSelectedWebinar(webinarTitle);
    setShowWebinarSignup(true);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Successfully signed up for ${selectedWebinar}!`);
    setShowWebinarSignup(false);
  };
  
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
              <li 
                className="flex items-center text-blue-600 hover:underline cursor-pointer"
                onClick={() => openVideo("https://www.youtube.com/embed/dQw4w9WgXcQ", "Getting Started Guide")}
              >
                Getting Started Guide
              </li>
              <li 
                className="flex items-center text-blue-600 hover:underline cursor-pointer"
                onClick={() => openVideo("https://www.youtube.com/embed/jNQXAC9IVRw", "Inventory Management Basics")}
              >
                Inventory Management Basics
              </li>
              <li 
                className="flex items-center text-blue-600 hover:underline cursor-pointer"
                onClick={() => openVideo("https://www.youtube.com/embed/8jLOx1hD3_o", "Advanced Reporting Features")}
              >
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
            <ul className="space-y-4">
              <li>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">New User Orientation</p>
                  <p className="text-sm text-muted-foreground">Every Monday at 2pm EST</p>
                  <Button 
                    onClick={() => openWebinarSignup("New User Orientation")}
                    variant="outline" 
                    size="sm"
                    className="mt-1 w-full"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Sign me up
                  </Button>
                </div>
              </li>
              <li>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">Advanced Features Workshop</p>
                  <p className="text-sm text-muted-foreground">Every Wednesday at 1pm EST</p>
                  <Button 
                    onClick={() => openWebinarSignup("Advanced Features Workshop")}
                    variant="outline" 
                    size="sm"
                    className="mt-1 w-full"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Sign me up
                  </Button>
                </div>
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
      
      {/* Video Dialog */}
      <Dialog open={videoUrl !== null} onOpenChange={(open) => !open && closeVideo()}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader className="pb-2">
            <DialogTitle>{videoTitle}</DialogTitle>
            <DialogClose className="absolute right-4 top-4" onClick={closeVideo}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {videoUrl && (
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={videoUrl}
                title={videoTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Webinar Signup Dialog */}
      <Dialog open={showWebinarSignup} onOpenChange={setShowWebinarSignup}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sign up for {selectedWebinar}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input 
                id="name" 
                type="text" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground" 
                placeholder="Enter your name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground" 
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowWebinarSignup(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Calendar className="mr-2 h-4 w-4" />
                Confirm Registration
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
