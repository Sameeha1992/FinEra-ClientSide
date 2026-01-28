import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  ArrowRightLeft,
  MessageCircle,
  BellIcon,
  LogOut
} from "lucide-react";
import { useDispatch } from "react-redux";
import { authService } from "@/api/AuthServiceAndProfile";
import { clearAuth } from "@/redux/slice/auth.slice";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface SidebarItem {
  icon: any;
  label: string;
  route?: string;
  action?:()=>void
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {role} = useSelector((state:RootState)=>state.auth)


  
  const handleLogout = async()=>{
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout failed",error)
    } finally{
      dispatch(clearAuth())
      if( role === "user"){
        navigate("/user/logout")
      }else{
        navigate("/vendor/logout")
      }
    }
  }

  const sidebarItems: SidebarItem[] = [
    { icon: User, label: "User Profile", route: "/user/user-profile" },
    { icon: FileText, label: "Loans", route: "/loans" },
    { icon: FileText, label: "Applications", route: "/applications" },
    { icon: ArrowRightLeft, label: "Transactions", route: "/transactions" },
    { icon: MessageCircle, label: "Chat Support", route: "/chat" },
    { icon: BellIcon, label: "Notifications", route: "/notifications" },
    { icon: LogOut, label: "Logout", action: handleLogout },
  ];


                  
  return (
    <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.route;

        return (
          <button
            key={item.label}
            onClick={() => {
              if(item.action){
                item.action();
              }else if(item.route){
                navigate(item.route)
              }
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-teal-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
