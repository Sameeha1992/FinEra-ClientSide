import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Edit, Lock, FileText } from "lucide-react";
import type { VendorCompleteProfileData } from "@/interfaces/vendor/profile/profile.interface";
import { vendorProfile } from "@/api/vendor/vendorProfile";
import { Field } from "@/components/shared/Field";
import { DocumentCard } from "@/components/shared/DocumentCard";

const VendorCompleteProfilePage = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] =
    useState<VendorCompleteProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await vendorProfile.getCompleteVendorProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch vendor profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!profileData) {
    return <div className="p-10 text-center">No profile data found</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                Complete Vendor Profile Details
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Review your submitted business information
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition">
                <Lock className="w-4 h-4" />
                Change Password
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition shadow-sm">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">
                  Pending Documents
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 w-full" />

          {/* Body */}
          <div className="p-6 md:p-8 space-y-10">

            {/* Profile Details */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">
                Business Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <Field label="Vendor ID" value={profileData.vendorId} />
                <Field label="Business Name" value={profileData.name} />
                <Field label="Email Address" value={profileData.email} />
                <Field label="Registration Number" value={profileData.registrationNumber} />
                <Field label="Licence Number" value={profileData.licenceNumber} />
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">
                Submitted Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCard
                  title="Registration Document"
                  url={profileData.documents?.registrationDocUrl}
                />

                <DocumentCard
                  title="Licence Document"
                  url={profileData.documents?.licenceDocUrl}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCompleteProfilePage;
