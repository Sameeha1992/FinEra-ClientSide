import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { vendorProfile } from "@/api/vendor/vendorProfile";
import { setProfileComplete } from "@/redux/slice/auth.slice";
import toast from "react-hot-toast";

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
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border">
      <h1 className="text-3xl font-bold text-center mb-6">
        Vendor Verification Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 🔒 Read-only Vendor Data from Redux */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={vendor.name || ""}
            readOnly
            className="border p-2 rounded bg-gray-100"
            placeholder="Vendor Name"
          />

          <input
            type="email"
            value={vendor.email || ""}
            readOnly
            className="border p-2 rounded bg-gray-100"
            placeholder="Email"
          />
          
        </div>

        {/* Licence Number */}
        <input
          type="text"
          value={formData.licenceNumber}
          onChange={handleInputChange}
          placeholder="Licence Number"
          className="border p-2 rounded w-full"
          required
        />

        {/* File Uploads */}
        <div className="space-y-4">

          {/* Registration Doc */}
          <div>
            <label className="block mb-1">Registration Document</label>
            <input
              type="file"
              className="hidden"
              id="registrationFile"
              onChange={(e) => handleFileChange(e, "registration")}
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label
              htmlFor="registrationFile"
              className="flex border p-2 rounded cursor-pointer justify-between items-center"
            >
              {fileNames.registration || "Browse file"}
              <Upload size={18} />
            </label>
          </div>

          {/* Licence Doc */}
          <div>
            <label className="block mb-1">Licence Document</label>
            <input
              type="file"
              className="hidden"
              id="licenceFile"
              onChange={(e) => handleFileChange(e, "licence")}
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label
              htmlFor="licenceFile"
              className="flex border p-2 rounded cursor-pointer justify-between items-center"
            >
              {fileNames.licence || "Browse file"}
              <Upload size={18} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
