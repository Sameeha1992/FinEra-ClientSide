import React, { useState } from "react";
import { Upload, ShieldCheck, User, Mail, FileText, Hash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { vendorProfile } from "@/api/vendor/vendorProfile";
import { setProfileComplete } from "@/redux/slice/auth.slice";
import toast from "react-hot-toast";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";

interface VendorVerificationData {
  licenceNumber: string;
  registrationDoc: File | null;
  licenceDoc: File | null;
}

export default function VendorProfileForm() {
  const vendor = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VendorVerificationData>({
    licenceNumber: "",
    registrationDoc: null,
    licenceDoc: null,
  });

  const [fileNames, setFileNames] = useState({
    registration: "",
    licence: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      licenceNumber: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "registration" | "licence"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "registration") {
      setFormData((prev) => ({ ...prev, registrationDoc: file }));
      setFileNames((prev) => ({ ...prev, registration: file.name }));
    } else {
      setFormData((prev) => ({ ...prev, licenceDoc: file }));
      setFileNames((prev) => ({ ...prev, licence: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.registrationDoc || !formData.licenceDoc) {
      toast.error("Please upload required documents");
      return;
    }

    try {
      const payload = {
        licence_number: formData.licenceNumber,
        registrationDoc: formData.registrationDoc,
        licenceDoc: formData.licenceDoc,
      };

      await vendorProfile.completeVendorProfile(payload);

      dispatch(setProfileComplete(true));
      toast.success("Vendor profile submitted successfully!");
      navigate("/vendor/vendor-complete-profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit vendor profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-56 overflow-y-auto">

        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Vendor Verification
                </h1>
                <p className="text-sm text-slate-500">
                  Complete your profile to start offering loan products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Area — pushed down with mt */}
        <div className="px-8 pt-10 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

              {/* Card Header */}
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/60">
                <h2 className="text-base font-semibold text-slate-700">
                  Verification Form
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in your licence details and upload the required documents
                </p>
              </div>

              {/* Card Body */}
              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-7">

                  {/* ── Read-only Vendor Info ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Vendor Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={vendor.name || ""}
                          readOnly
                          placeholder="Vendor Name"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm outline-none cursor-not-allowed"
                        />
                      </div>
                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={vendor.email || ""}
                          readOnly
                          placeholder="Email"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100" />

                  {/* ── Licence Number ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Licence Details
                    </p>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.licenceNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Licence Number"
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100" />

                  {/* ── File Uploads ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Document Uploads
                    </p>
                    <div className="space-y-4">

                      {/* Registration Document */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Registration Document
                        </label>
                        <input
                          type="file"
                          className="hidden"
                          id="registrationFile"
                          onChange={(e) => handleFileChange(e, "registration")}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="registrationFile"
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${fileNames.registration
                              ? "border-teal-400 bg-teal-50/50 text-teal-700"
                              : "border-slate-300 hover:border-teal-400 hover:bg-teal-50/30 text-slate-500"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate max-w-xs">
                              {fileNames.registration || "Browse or drop a file..."}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium bg-white border border-current rounded-md px-2.5 py-1 flex-shrink-0">
                            <Upload size={13} />
                            Upload
                          </div>
                        </label>
                        <p className="text-xs text-slate-400 mt-1">
                          Accepted formats: PDF, JPG, PNG
                        </p>
                      </div>

                      {/* Licence Document */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Licence Document
                        </label>
                        <input
                          type="file"
                          className="hidden"
                          id="licenceFile"
                          onChange={(e) => handleFileChange(e, "licence")}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="licenceFile"
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${fileNames.licence
                              ? "border-teal-400 bg-teal-50/50 text-teal-700"
                              : "border-slate-300 hover:border-teal-400 hover:bg-teal-50/30 text-slate-500"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate max-w-xs">
                              {fileNames.licence || "Browse or drop a file..."}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium bg-white border border-current rounded-md px-2.5 py-1 flex-shrink-0">
                            <Upload size={13} />
                            Upload
                          </div>
                        </label>
                        <p className="text-xs text-slate-400 mt-1">
                          Accepted formats: PDF, JPG, PNG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors shadow-sm shadow-teal-200"
                    >
                      Submit Verification
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
