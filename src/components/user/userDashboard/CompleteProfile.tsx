

import { Mail, Phone, Edit2, Lock } from 'lucide-react';
import type { UserProfileDisplayProps } from '@/interfaces/user/userProfile/profile.complete.interface';

export default function UserProfileDisplay({
  personalInfo,
  financialInfo,
  documentInfo, 
  onEditDetails,
  onChangePassword,
}: UserProfileDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Personal Information Section */}
      <div className="rounded-2xl overflow-hidden border-2 border-teal-500 bg-white">
        <div className="bg-teal-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Full Name</label>
              <p className="text-base font-medium text-gray-900">{personalInfo?.fullName}</p>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Date of Birth</label>
              <p className="text-base font-medium text-gray-900">{personalInfo?.dateOfBirth}</p>
            </div>
            {/* Email */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Email Address</label>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500" />
                {personalInfo?.email}
              </p>
            </div>
            {/* Gender */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Gender</label>
              <p className="text-base font-medium text-gray-900">{personalInfo?.gender}</p>
            </div>
            {/* Phone Number */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Phone Number</label>
              <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-500" />
                {personalInfo?.phone}
              </p>
            </div>
            {/* Customer ID */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Customer ID</label>
              <p className="text-base font-medium text-gray-900">{personalInfo?.customerId}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onEditDetails}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Details
            </button>
            <button
              onClick={onChangePassword}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="rounded-2xl overflow-hidden border-2 border-teal-500 bg-white">
        <div className="bg-teal-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Financial Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Occupation */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Occupation</label>
              <p className="text-base font-medium text-gray-900">{financialInfo?.occupation}</p>
            </div>
            {/* CIBIL Score */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">CIBIL Score</label>
              <p className="text-base font-medium text-gray-900">{financialInfo?.cibilScore}</p>
            </div>
            {/* Annual Income */}
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Annual Income</label>
              <p className="text-base font-medium text-gray-900">₹{financialInfo?.annualIncome}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Information Section */}
      <div className="rounded-2xl overflow-hidden border-2 border-teal-500 bg-white">
        <div className="bg-teal-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">Document Information</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Aadhar Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-teal-500 mb-3">Aadhar Details</h3>
              <label className="text-xs text-gray-600 uppercase tracking-wide">Aadhar Number</label>
              <p className="text-base font-medium text-gray-900 mb-4">{documentInfo?.aadharNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-teal-500 mb-3">Aadhar Document</h3>
              {documentInfo?.aadharDocument && (
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
                  <img
                    src={documentInfo?.aadharDocument || "/placeholder.svg"}
                    alt="Aadhar Document"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PAN Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-teal-500 mb-3">PAN Details</h3>
              <label className="text-xs text-gray-600 uppercase tracking-wide">PAN Card Number</label>
              <p className="text-base font-medium text-gray-900 mb-4">{documentInfo?.panNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-teal-500 mb-3">PAN Document</h3>
              {documentInfo?.panDocument && (
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
                  <img
                    src={documentInfo?.panDocument || "/placeholder.svg"}
                    alt="PAN Document"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}    