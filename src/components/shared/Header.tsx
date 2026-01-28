import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { authService } from "@/api/AuthServiceAndProfile";
import { clearAuth } from "@/redux/slice/auth.slice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);


  const {name,role,isAuthenticated} = useSelector((state:RootState)=>state.auth);

  if(!isAuthenticated) return null;

  const firstLetter = name ? name.charAt(0).toUpperCase():"U"

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.log("Logout failed",error)
    }finally{
      dispatch(clearAuth());

      navigate("/user/login");
    }
  };

  
    const goToProfile =()=>{
      navigate("/user/user-profile");
      setOpen(false)
    }

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
                    {name}
                  </p>
                </div>

                <button
                  onClick={goToProfile}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <User size={16} />
                  Profile
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
