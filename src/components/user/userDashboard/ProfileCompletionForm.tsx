import React, { useState } from "react";
import { Upload } from "lucide-react";
import { userProfile } from "@/api/user/userProfile";
import type { CompleteProfileForm } from "@/interfaces/user/userProfile/profile.complete.interface";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setProfileComplete } from "@/redux/slice/auth.slice";
import { useNavigate } from "react-router-dom";
import { verificationSchema } from "@/validations/user/user.profileForm.validation";

export type Gender = "male" | "female" | "other";

interface VerificationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender | "";
  dateOfBirth: string;
  occupation: string;
  annualIncome: string;
  adhaarNumber: string;
  panNumber: string;
  cibilScore: string;
  panDocument: File | null;
  aadharDocument: File | null;
}

type DocType = "pan" | "aadhar";

export default function VerificationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VerificationData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    annualIncome: "",
    adhaarNumber: "",
    panNumber: "",
    cibilScore: "",
    panDocument: null,
    aadharDocument: null,
  });

  const [fileNames, setFileNames] = useState({
    pan: "",
    aadhar: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: DocType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(
      (prev) => ({ ...prev, [`${docType}Document`]: file }) as VerificationData,
    );
    setFileNames((prev) => ({ ...prev, [docType]: file.name }));
  };

  // This is the correct form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = verificationSchema.safeParse({
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        adhaarNumber: formData.adhaarNumber,
        panNumber: formData.panNumber,
        cibilScore: formData.cibilScore,
        panDocument: formData.panDocument,
        aadharDocument: formData.aadharDocument,
      });

      if(!formData.gender){
        setErrors((prev)=>({...prev,gender:"Gender is required"}))
      }

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Clear errors if validation passed
      setErrors({});

      const data: CompleteProfileForm = {
        fullName: user.name || "",
        email: user.email || "",
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        gender: formData.gender || undefined,
        job: formData.occupation,
        income: formData.annualIncome,
        adhaarNumber: formData.adhaarNumber,
        panNumber: formData.panNumber,
        cibilScore: formData.cibilScore,
        panDoc: formData.panDocument as File,
        adhaarDoc: formData.aadharDocument as File,
      };

      const response = await userProfile.completeUserProfile(data);

      console.log("Profile submitted successfully:", response);
      dispatch(setProfileComplete(true));
      alert("Profile submitted successfully!");
      navigate("/user/user-profile");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit profile!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">
        Verification Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            value={user.name || ""}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="border p-2 rounded"
          />

          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}

          <input
            type="email"
            name="email"
            value={user.email || ""}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
        )}

        <div className="col-span-2">
          <label className="block mb-1 font-medium">Gender</label>
          <div className="flex gap-6">
            {(["male", "female", "other"] as const).map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleInputChange}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>

          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            placeholder="Occupation"
            className="border p-2 rounded"
          />

          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
          )}
          <input
            type="text"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleInputChange}
            placeholder="Annual Income"
            className="border p-2 rounded"
          />

          {errors.annualIncome && (
            <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>
          )}

          <input
            type="text"
            name="adhaarNumber"
            value={formData.adhaarNumber}
            onChange={handleInputChange}
            placeholder="Adhaar Number"
            className="border p-2 rounded col-span-2"
          />

          {errors.adhaarNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.adhaarNumber}</p>
          )}

          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            placeholder="Pancard Number"
            className="border p-2 rounded col-span-2"
          />

          {errors.panNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
          )}

          <input
            type="text"
            name="cibilScore"
            value={formData.cibilScore}
            onChange={handleInputChange}
            placeholder="CIBIL Score"
            className="border p-2 rounded col-span-2"
          />
        </div>

        {errors.cibilScore && (
          <p className="text-red-500 text-sm mt-1">{errors.cibilScore}</p>
        )}

        {/* File Uploads */}
        <div className="space-y-4">
          {(["pan", "aadhar"] as DocType[]).map((doc) => (
            <div key={doc}>
              <label className="block mb-1">{doc.toUpperCase()} Document</label>
              <input
                type="file"
                className="hidden"
                id={`${doc}File`}
                onChange={(e) => handleFileChange(e, doc)}
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {errors.panDocument && (
                <p className="text-red-500 text-sm">{errors.panDocument}</p>
              )}

              {errors.aadharDocument && (
                <p className="text-red-500 text-sm">{errors.aadharDocument}</p>
              )}

              <label
                htmlFor={`${doc}File`}
                className="flex border p-2 rounded cursor-pointer justify-between items-center"
              >
                {fileNames[doc] || "Browse file"}
                <Upload size={18} />
              </label>
            </div>
          ))}
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
