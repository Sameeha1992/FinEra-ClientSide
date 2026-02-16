// components/vendor/dashboard/VendorProfile/CompleteProfileDetails.tsx
import { DocumentCard } from "@/components/shared/DocumentCard";
import { Field } from "@/components/shared/Field";
import { Lock, Edit, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { VendorCompleteProfileData } from "@/interfaces/vendor/profile/profile.interface";

interface CompleteProfileDetailsProps {
  profileData: VendorCompleteProfileData;
}

export function CompleteProfileDetails({ profileData }: CompleteProfileDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden mt-10 p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            Complete Vendor Profile Details
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Review your submitted business information
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/vendor/vendor-change-password")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition"
          >
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

      <div className="h-px bg-zinc-100 w-full mb-6" />

      {/* Profile Details */}
      <div className="space-y-10">
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

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">
            Submitted Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentCard title="Registration Document" url={profileData.documents?.registrationDocUrl} />
            <DocumentCard title="Licence Document" url={profileData.documents?.licenceDocUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
