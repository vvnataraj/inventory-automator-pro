
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const LoginBranding = () => {
  const textRef = useRef<HTMLDivElement>(null);

  const downloadLogoAsImage = () => {
    if (!textRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = textRef.current.offsetWidth;
    canvas.height = textRef.current.offsetHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Create a linear gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#9333ea"); // purple-600
    gradient.addColorStop(0.5, "#6366f1"); // indigo-500
    gradient.addColorStop(1, "#9333ea"); // purple-600
    
    // Apply the gradient fill
    ctx.fillStyle = gradient;
    
    // Set font properties to match the text
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("STOCK", 0, 40);
    
    // Add the purple 'topus' part
    ctx.fillStyle = "#9333ea"; // purple-600
    ctx.fillText("topus", 140, 40);
    
    // Convert canvas to image and download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "stocktopus-logo.png";
    link.href = dataUrl;
    link.click();
  };

  return (
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
        <div ref={textRef} className="relative">
          <span className="font-bold text-6xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
            STOCK<span className="text-purple-600">topus</span>
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={downloadLogoAsImage}
            title="Download STOCKtopus logo"
          >
            <Download className="h-4 w-4 text-purple-600" />
          </Button>
        </div>
        <span className="text-2xl text-gray-600">It's like having 8 arms but better, it's like having 9 arms.</span>
      </div>
      <p className="mt-6 text-lg text-gray-700 max-w-md">
        Efficiently manage your inventory, track orders, and analyze sales all in one place. Take control of your business today.
      </p>
    </div>
  );
};
