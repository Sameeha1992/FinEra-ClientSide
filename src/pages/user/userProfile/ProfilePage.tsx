// pages/ProfilePage.tsx
import { userProfile, type userData } from "@/api/user/userProfile";
import ProfileCard from "@/components/user/userDashboard/ProfileCard";
import type { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export default function ProfilePage() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [user,setUserData] = useState<userData |null>(null);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{
    const fetchprofile = async ()=>{
      try {
        const res = await userProfile.getUserProfile()
        setUserData(res)
        
      } catch (error) {
        console.error("Failed to fetch profile",error)
      }finally{
        setLoading(false)
      }
    };

    if(auth.isAuthenticated){
      fetchprofile();
    }
  },[auth.isAuthenticated]);


  if (!auth.isAuthenticated) {
    return <p className="text-center mt-10">Please login</p>;
  }


  if(loading){
    return <p className="text-center mt-10">Loading...</p>;
  }

  if(!user){
        return <p className="text-center mt-10">No profile data</p>;
 
  }

  return (
    <div className="flex justify-center mt-10">
      <ProfileCard
        name={user.name}
        customerId={user.customerId}
        email={user.email}
        status={user.status}
      />
    </div>
  );
}
