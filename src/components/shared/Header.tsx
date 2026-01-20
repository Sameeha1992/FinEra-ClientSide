import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Temporary user (later replace with backend data / context)
  const user = {
    name: "Sameeha Ansari",
  };

  const firstLetter = user.name.charAt(0).toUpperCase();

  const handleLogout = () => {
    // later: clear token / user state
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-9 h-9 bg-teal-600 rounded-lg">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800">FinEra</span>
          </div>

          {/* Right Section */}
          <div className="relative">
            {/* Avatar */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shadow hover:bg-teal-700 transition"
            >
              {firstLetter}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}
