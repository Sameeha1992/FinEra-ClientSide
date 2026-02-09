// pages/Dashboard.tsx
import { User, FileText, ArrowRightLeft, MessageCircle, BellIcon } from "lucide-react";
import { Outlet } from "react-router-dom";
import {Sidebar} from "@/components/shared/user/Sidebar";
import TopNav from "@/components/shared/user/TopNav";
// import ProfilePage from "./ProfilePage";
// import CompleteProfilePage from "./CompleteProfilePage";

export default function Dashboard() {
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNav />

      {/* Sidebar */}
      <Sidebar/>
        
        
      {/* Main Content */}
      <div className="flex-1 ml-64 mt-20 p-8">
        <Outlet /> {/* Render the active route here */}
        {/* <ProfilePage/>
        <CompleteProfilePage/> */}
      </div>
    </div>
  );
}
