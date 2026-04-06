import React, { useState, useEffect } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { DOBPicker } from "@/components/ui/DOBPicker";
import { userProfile } from "@/api/user/userProfile";
import type { CompleteProfileForm } from "@/interfaces/user/userProfile/profile.complete.interface";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { verificationSchema } from "@/validations/user/user.profileForm.validation";
import { useNavigate } from "react-router-dom";

export type Gender = "male" | "female" | "other";

interface UpdateProfileData {
  name: string;
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

export default function UpdateProfileForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [existingDocs, setExistingDocs] = useState<{
    pan?: string;
    aadhar?: string;
  }>({});
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const isVerified = user.status?.toUpperCase() === "VERIFIED";
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
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

  const [fileNames, setFileNames] = useState({ pan: "", aadhar: "" });

  // Pre-populate fields from existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfile.getCompleteProfile();
        setFormData((prev) => ({
          ...prev,
          name: data.name || user.name || "",
          email: data.email || user.email || "",
          phoneNumber: data.phone ? String(data.phone) : "", // convert number -> string
          gender: (data.gender as Gender) || "",
          dateOfBirth: data.dob || "",
          occupation: data.job || "",
          annualIncome: data.income ? String(data.income) : "", // convert number -> string
          adhaarNumber: data.adhaarNumber || "",
          panNumber: data.panNumber || "",
          cibilScore: data.cibilScore ? String(data.cibilScore) : "", // convert number -> string
          panDocument: null,
          aadharDocument: null,
        }));

        setExistingDocs({
          pan: data.documents?.panDocUrl, // assume backend gives signed URL
          aadhar: data.documents?.adhaarDocUrl,
        });

        // Show file name if already uploaded
        setFileNames({
          pan: data.documents?.panDocUrl ? "Existing File" : "",
          aadhar: data.documents?.adhaarDocUrl ? "Existing File" : "",
        });
      } catch {
        // fallback to redux values
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  },[]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Changing",name,value)
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
      (prev) =>
        ({ ...prev, [`${docType}Document`]: file }) as UpdateProfileData,
    );
    setFileNames((prev) => ({ ...prev, [docType]: file.name }));
    setExistingDocs((prev) => ({ ...prev, [docType]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("");

    // Validate with a partial schema (documents optional for update)
    const partialSchema = verificationSchema.partial({
      panDocument: true,
      aadharDocument: true,
    });

    const result = partialSchema.safeParse({
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      occupation: formData.occupation,
      annualIncome: formData.annualIncome,
      adhaarNumber: formData.adhaarNumber,
      panNumber: formData.panNumber,
      cibilScore: formData.cibilScore,
      panDocument: formData.panDocument ?? undefined,
      aadharDocument: formData.aadharDocument ?? undefined,
    });

    if (!formData.gender) {
      setErrors((prev) => ({ ...prev, gender: "Gender is required" }));
    }

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return;
    }

    if (!formData.gender) return; // guard after error set

    setErrors({});
    setSubmitting(true);

    try {
      const data: Partial<CompleteProfileForm> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        gender: formData.gender as Gender,
        job: formData.occupation,
        income: formData.annualIncome,
        adhaarNumber: formData.adhaarNumber,
        panNumber: formData.panNumber,
        cibilScore: formData.cibilScore,
      };

      if (!isVerified) {
        data.adhaarNumber = formData.adhaarNumber;
        data.panNumber = formData.panNumber;

        if (formData.panDocument) {
          data.panDoc = formData.panDocument;
        }

        if (formData.aadharDocument) {
          data.adhaarDoc = formData.aadharDocument;
        }
      }

      await userProfile.updateUserProfile(data);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => navigate("/user/user-complete-profile"), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      setErrors({ form: "Failed to update profile. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
        Update Profile
      </h1>
      <p className="text-center text-gray-500 text-sm mb-6">
        Edit your personal, financial, and document details below.
      </p>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-300 text-teal-700 rounded-lg px-4 py-3 mb-6">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Global form error */}
      {errors.form && (
        <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Personal Information ── */}
        <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
          <legend className="text-sm font-semibold text-teal-600 px-2">
            Personal Information
          </legend>

          <div className="grid grid-cols-2 gap-4">
            {/* Full Name – read-only from Redux */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-200 bg-gray-50 p-2 rounded-lg text-gray-600"
              />
            </div>

            {/* Email – read-only from Redux */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-200 bg-gray-50 p-2 rounded-lg text-gray-600"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.phoneNumber ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Date of Birth Picker (MUI) */}
            <div className="col-span-1">
              <DOBPicker
                value={formData.dateOfBirth}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, dateOfBirth: val }));
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.dateOfBirth;
                    return copy;
                  });
                }}
                error={errors.dateOfBirth}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Gender</label>
            <div className="flex gap-6 mt-1">
              {(["male", "female", "other"] as const).map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleInputChange}
                    className="accent-teal-500"
                  />
                  <span className="capitalize text-sm">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>
        </fieldset>

        {/* ── Financial Information ── */}
        <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
          <legend className="text-sm font-semibold text-teal-600 px-2">
            Financial Information
          </legend>

          <div className="grid grid-cols-2 gap-4">
            {/* Occupation */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="e.g. Software Engineer"
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.occupation ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.occupation && (
                <p className="text-red-500 text-xs">{errors.occupation}</p>
              )}
            </div>

            {/* Annual Income */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Annual Income
              </label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                placeholder="e.g. 500000"
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.annualIncome ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.annualIncome && (
                <p className="text-red-500 text-xs">{errors.annualIncome}</p>
              )}
            </div>

            {/* CIBIL Score */}
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-gray-500">
                CIBIL Score
              </label>
              <input
                type="text"
                name="cibilScore"
                value={formData.cibilScore}
                onChange={handleInputChange}
                placeholder="3-digit score e.g. 750"
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.cibilScore ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.cibilScore && (
                <p className="text-red-500 text-xs">{errors.cibilScore}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* ── Document Information ── */}
        <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
          <legend className="text-sm font-semibold text-teal-600 px-2">
            Document Information
          </legend>

          {/* Aadhaar Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Aadhaar Number
            </label>
            <input
              type="text"
              name="adhaarNumber"
              disabled={isVerified}
              value={formData.adhaarNumber}
              onChange={handleInputChange}
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              className={`border p-2 rounded-lg ${
                isVerified ? "bg-gray-100 cursor-not-allowed" : ""
              } focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.adhaarNumber ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.adhaarNumber && (
              <p className="text-red-500 text-xs">{errors.adhaarNumber}</p>
            )}
          </div>

          {/* PAN Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              disabled={isVerified}
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              className={`border p-2 rounded-lg ${
                isVerified ? "bg-gray-100 cursor-not-allowed" : ""
              } focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.panNumber ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.panNumber && (
              <p className="text-red-500 text-xs">{errors.panNumber}</p>
            )}
          </div>

          {/* File Uploads – optional on update */}
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              Document uploads are optional — leave blank to keep existing
              files.
            </p>
            {(["pan", "aadhar"] as DocType[]).map((doc) => (
              <div key={doc} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  {doc === "pan" ? "PAN" : "Aadhaar"} Document
                  <span className="ml-1 text-gray-400">(optional)</span>
                </label>

                {existingDocs[doc] && (
                  <img
                    src={existingDocs[doc]}
                    alt={`${doc} preview`}
                    className="w-40 h-24 object-cover border rounded-lg mb-1"
                  />
                )}
                <input
                  type="file"
                  disabled={isVerified}
                  className="hidden"
                  id={`${doc}File`}
                  onChange={(e) => handleFileChange(e, doc)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor={`${doc}File`}
                  className="flex border border-gray-300 p-2 rounded-lg cursor-pointer justify-between items-center hover:border-teal-400 transition-colors"
                >
                  <span className="text-sm text-gray-500">
                    {fileNames[doc] || "Browse file…"}
                  </span>
                  <Upload size={16} className="text-gray-400" />
                </label>
                {doc === "pan" && errors.panDocument && (
                  <p className="text-red-500 text-xs">{errors.panDocument}</p>
                )}
                {doc === "aadhar" && errors.aadharDocument && (
                  <p className="text-red-500 text-xs">
                    {errors.aadharDocument}
                  </p>
                )}
                {isVerified && (
                  <p className="text-xs text-gray-400 mb-2">
                    Documents cannot be modified after verification.
                  </p>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
