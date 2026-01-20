// components/TopNav.tsx
import type { FC } from "react";
import { Bell } from "lucide-react";

const TopNav: FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-teal-600">FinEra</span>
        </div>

        {/* Center Navigation */}
        <nav className="flex gap-8">
          <a href="#" className="text-gray-800 font-medium hover:text-teal-600 border-b-2 border-gray-800">
            Home
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-teal-600">
            Loans
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-teal-600">
            About Us
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-teal-600">
            Contact Us
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          <button className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition">
            Login/Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
