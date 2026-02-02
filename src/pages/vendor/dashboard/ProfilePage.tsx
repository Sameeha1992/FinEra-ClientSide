
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import ProfileCard from "@/components/vendor/dashboard/shared/ProfileCard";
import { FileText } from 'lucide-react';
import { useEffect, useState } from "react";
import { vendorProfile } from "@/api/vendor/vendorProfile";


interface vendorProfile{
    bankName:string;
    vendorId:string,
    email:string,
    registerationNumber:string,
    isVerified:boolean
}
const ProfilePage = () => {

    const [vendor,setVendor] = useState<vendorProfile |null>(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string |null>(null);

    useEffect(()=>{
     
        const fetchVendorProfile = async ()=>{
            try {
                setLoading(true);

                const data = await vendorProfile.getVendorProfile();

                setVendor({
                    bankName:data.name,
                    vendorId:data.vendorId,
                    email:data.email,
                    registerationNumber:data.registrationNumber,
                    isVerified:data.isVerified ?? false
                })
                
            } catch (error) {
                setError("Failed to load vendor profile")
            }finally{
                setLoading(false)
            }
        }
        fetchVendorProfile()
    },[])

    

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  if (!vendor) return null;


  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-56 p-10"> {/* ml-56 to leave space for the sidebar width */}

        {/* Page Header: Icon + Pill + Title */}
        <div className="flex items-center gap-3 mb-8">
          {/* Small pill indicating section */}
          <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-semibold">
            Profile
          </span>

          {/* Icon + Title */}
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <FileText size={28} className="text-teal-600" />
            Vendor Profile
          </h1>
        </div>

        {/* Centered Profile Card */}
        <div className="flex justify-center">
          <ProfileCard
            bankName={vendor.bankName}
            vendorId={vendor.vendorId}
            email={vendor.email}
            registrationNumber={vendor.registerationNumber}
            isVerified={vendor.isVerified} 
          />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;