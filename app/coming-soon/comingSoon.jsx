"use client";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 px-4 py-10">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-600 animate-pulse">
          🚧 Coming Soon!
        </h1>

        <p className="text-lg sm:text-xl text-gray-700">
          We're working hard to bring you something amazing. Stay tuned for the big launch!
        </p>

        <div className="flex justify-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-orange-500 rounded-full animate-bounce shadow-lg flex items-center justify-center text-white text-2xl font-semibold">
            🔧 Under Construction
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default ComingSoon;
