
import React from "react";
import { Button } from "@/components/ui/button.tsx";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-teal-600 rounded-lg">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800">FinEra</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Loans</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Contact Us</a>
          </div>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
            Login/Register
          </Button>
        </nav>
      </div>
    </header>
  );
}
