
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const LoginBranding = () => {
  const logoTextRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!logoTextRef.current) return;
    
    const element = logoTextRef.current;
    
    // Create canvas with proper dimensions
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    
    // Get element dimensions and set canvas size
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Set transparent background
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Convert HTML to image
    const html2canvas = window.html2canvas;
    if (!html2canvas) {
      console.error("html2canvas not available");
      return;
    }
    
    html2canvas(element, {
      backgroundColor: null, // Transparent background
      scale: 2, // Better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then(canvas => {
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stocktopus-logo.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center text-center">
      <div className="flex flex-col items-center">
        <div ref={logoTextRef} className="flex flex-col items-center">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
              alt="STOCKtopus Logo" 
              className="h-36 w-36 object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-6xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
              STOCK<span className="text-purple-600">topus</span>
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 mb-4"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Logo
        </Button>
        
        <span className="text-2xl text-gray-600">It's like having 8 arms but better, it's like having 9 arms.</span>
        <p className="mt-6 text-lg text-gray-700 max-w-md text-center">
          Efficiently manage your inventory, track orders, and analyze sales all in one place. Take control of your business today.
        </p>
      </div>
    </div>
  );
};
