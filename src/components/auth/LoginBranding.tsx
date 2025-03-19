
import React from "react";

export const LoginBranding = () => {
  return (
    <div className="flex-1 flex flex-col items-center text-center">
      <div className="flex flex-col items-center">
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
          <span className="text-2xl text-gray-600">It's like having 8 arms but better, it's like having 9 arms.</span>
        </div>
        <p className="mt-6 text-lg text-gray-700 max-w-md text-center">
          Efficiently manage your inventory, track orders, and analyze sales all in one place. Take control of your business today.
        </p>
      </div>
    </div>
  );
};
