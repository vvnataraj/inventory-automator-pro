
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

export const LoginBranding = () => {
  const logoTextRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!logoTextRef.current) return;
    
    const element = logoTextRef.current;
    
    // Get element dimensions
    const rect = element.getBoundingClientRect();
    
    // Convert HTML to image
    html2canvas(element, {
      backgroundColor: null, // Transparent background
      scale: 4, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: rect.width,
      height: rect.height,
      onclone: (documentClone) => {
        // Ensure all styles are applied in the cloned document
        const clonedElement = documentClone.getElementById('logo-text-container');
        if (clonedElement) {
          // Force text styles to be visible on export
          const gradientText = clonedElement.querySelector('.gradient-text');
          if (gradientText) {
            gradientText.classList.add('force-gradient');
          }
        }
      }
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
        <div ref={logoTextRef} id="logo-text-container" className="flex flex-col items-center">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/f849ba67-c0f4-4e4b-9f84-e91df8d9b64d.png" 
              alt="STOCKtopus Logo" 
              className="h-36 w-36 object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-6xl gradient-text bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
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
