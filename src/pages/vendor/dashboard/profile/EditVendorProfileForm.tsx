import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";
import { vendorProfile } from "@/api/vendor/vendorProfile";
import type { VendorCompleteProfileData } from "@/interfaces/vendor/profile/profile.interface";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";

type DocType = "registration" | "licence";

interface EditVendorFormData {
    vendorId: string;          // display only – not sent to API
    name?: string;
    email?: string;
    registrationNumber?: string;
    licenceNumber?: string;
    registrationDoc: File | null;
    licenceDoc: File | null;
}

interface FileNames {
    registration: string;
    licence: string;
}

interface ExistingDocs {
    registration?: string;
    licence?: string;
}

export default function EditVendorProfileForm() {
    const navigate = useNavigate();

   
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [existingDocs, setExistingDocs] = useState<ExistingDocs>({});
    const [fileNames, setFileNames] = useState<FileNames>({
        registration: "",
        licence: "",
    });

    const [formData, setFormData] = useState<EditVendorFormData>({
        vendorId: "",
        name: "",
        email: "",
        registrationNumber: "",
        licenceNumber: "",
        registrationDoc: null,
        licenceDoc: null,
    });

    // ── Pre-populate from API ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data: VendorCompleteProfileData =
                    await vendorProfile.getCompleteVendorProfile();

                setFormData((prev) => ({
                    ...prev,
                    vendorId: data.vendorId || "",
                    name: data.name || "",
                    email: data.email || "",
                    registrationNumber: data.registrationNumber || "",
                    licenceNumber: data.licenceNumber || "",
                }));

                // Debug: log full API response to verify field names
                console.log("Vendor complete profile data:", data);
                console.log("Documents:", data.documents);

                setExistingDocs({
                    registration:
                        data.documents?.registrationDocUrl ||
                        (data as Record<string, unknown>)["registrationDoc"] as string || "",
                    licence:
                        data.documents?.licenceDocUrl ||
                        (data as Record<string, unknown>)["licenceDoc"] as string || "",
                });

                setFileNames({
                    registration: data.documents?.registrationDocUrl
                        ? "Existing File"
                        : "",
                    licence: data.documents?.licenceDocUrl ? "Existing File" : "",
                });
            } catch (err) {
                console.error("Failed to fetch vendor profile", err);
                setErrors({ form: "Could not load profile data. Please try again." });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
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
        docType: DocType
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const key = docType === "registration" ? "registrationDoc" : "licenceDoc";
        setFormData((prev) => ({ ...prev, [key]: file }));
        setFileNames((prev) => ({ ...prev, [docType]: file.name }));
        setExistingDocs((prev) => ({ ...prev, [docType]: "" }));

        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.licenceNumber?.trim()) {
            newErrors.licenceNumber = "Licence number is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMsg("");

        if (!validate()) return;

        setSubmitting(true);

        try {
            await vendorProfile.updateCompleteVendorProfile({
                ...(formData.name && { name: formData.name }),
                ...(formData.email && { email: formData.email }),
                ...(formData.registrationNumber && { registrationNumber: formData.registrationNumber }),
                ...(formData.licenceNumber && { licenceNumber: formData.licenceNumber }),
                ...(formData.registrationDoc && { registrationDoc: formData.registrationDoc }),
                ...(formData.licenceDoc && { licenceDoc: formData.licenceDoc }),
            });

            setSuccessMsg("Profile updated successfully!");
            setTimeout(
                () => navigate("/vendor/vendor-complete-profile"),
                1500
            );
        } catch (err) {
            console.error("Failed to update vendor profile", err);
            setErrors({ form: "Failed to update profile. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex h-screen bg-zinc-50">
                <Sidebar />
                <div className="flex-1 ml-56 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar />

            <div className="flex-1 ml-56 overflow-y-auto h-full">
                <div className="py-10 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">

                            {/* ── Header ── */}
                            <div className="p-6 md:p-8 border-b border-zinc-100">
                                <h1 className="text-2xl font-bold text-zinc-900">
                                    Edit Vendor Profile
                                </h1>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Update your business information and documents below.
                                </p>
                            </div>

                            {/* ── Body ── */}
                            <div className="p-6 md:p-8">

                                {/* Success banner */}
                                {successMsg && (
                                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-300 text-teal-700 rounded-lg px-4 py-3 mb-6">
                                        <CheckCircle size={16} />
                                        <span className="text-sm">{successMsg}</span>
                                    </div>
                                )}

                                {/* Global error banner */}
                                {errors.form && (
                                    <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
                                        {errors.form}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* ── Business Information ── */}
                                    <fieldset className="border border-zinc-200 rounded-xl p-5 space-y-4">
                                        <legend className="text-sm font-semibold text-teal-600 px-2">
                                            Business Information
                                        </legend>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            {/* Vendor ID — read-only */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    Vendor ID
                                                </label>
                                                <input
                                                    type="text"
                                                    name="vendorId"
                                                    value={formData.vendorId}
                                                     readOnly
                                                    className="border border-zinc-200 bg-zinc-50 p-2 rounded-lg text-zinc-400 cursor-not-allowed text-sm"
                                                />
                                            </div>

                                            {/* Business Name */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    Business Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Business / Company name"
                                                    className={`border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.name
                                                        ? "border-red-400"
                                                        : "border-zinc-300"
                                                        }`}
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                                )}
                                            </div>

                                            {/* Email — read-only */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    readOnly
                                                    className="border border-zinc-200 bg-zinc-50 p-2 rounded-lg text-zinc-400 cursor-not-allowed text-sm"
                                                />
                                            </div>

                                            {/* Registration Number — read-only */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    Registration Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="registrationNumber"
                                                    value={formData.registrationNumber}
                                                    
                                                    className="border border-zinc-200 bg-zinc-50 p-2 rounded-lg text-zinc-400 text-sm"
                                                />
                                            </div>

                                            {/* Licence Number — editable */}
                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    Licence Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="licenceNumber"
                                                    value={formData.licenceNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter licence number"
                                                    className={`border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.licenceNumber
                                                        ? "border-red-400"
                                                        : "border-zinc-300"
                                                        }`}
                                                />
                                                {errors.licenceNumber && (
                                                    <p className="text-red-500 text-xs">
                                                        {errors.licenceNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </fieldset>

                                    {/* ── Documents ── */}
                                    <fieldset className="border border-zinc-200 rounded-xl p-5 space-y-5">
                                        <legend className="text-sm font-semibold text-teal-600 px-2">
                                            Documents
                                        </legend>

                                        <p className="text-xs text-zinc-400">
                                            Leave a document upload blank to keep the existing file.
                                            Accepted formats: PDF, JPG, JPEG, PNG.
                                        </p>

                                        {/* Registration Document */}
                                        {(
                                            [
                                                {
                                                    key: "registration" as DocType,
                                                    label: "Registration Document",
                                                    docKey: "registrationDoc",
                                                },
                                                {
                                                    key: "licence" as DocType,
                                                    label: "Licence Document",
                                                    docKey: "licenceDoc",
                                                },
                                            ] as const
                                        ).map(({ key, label }) => (
                                            <div key={key} className="flex flex-col gap-2">
                                                <label className="text-xs font-medium text-zinc-500">
                                                    {label}
                                                    <span className="ml-1 text-zinc-400">(optional)</span>
                                                </label>

                                                {/* ── Existing document preview ── */}
                                                {existingDocs[key] && (
                                                    <div className="flex flex-col gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                                                        <p className="text-xs font-medium text-zinc-500">
                                                            Current file:
                                                        </p>

                                                        {/* Image preview for image URLs */}
                                                        {/\.(jpg|jpeg|png|webp)($|\?)/i.test(existingDocs[key]!) ? (
                                                            <img
                                                                src={existingDocs[key]}
                                                                alt={`${label} preview`}
                                                                className="w-full max-w-xs h-32 object-cover border border-zinc-200 rounded-lg"
                                                            />
                                                        ) : (
                                                            /* Generic document icon for PDF / unknown */
                                                            <div className="flex items-center gap-2 text-zinc-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                                </svg>
                                                                <span className="text-xs text-zinc-500 truncate">
                                                                    Uploaded document
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Always show a "View" link */}
                                                        <a
                                                            href={existingDocs[key]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-teal-600 underline hover:text-teal-700 w-fit"
                                                        >
                                                            View document ↗
                                                        </a>
                                                    </div>
                                                )}

                                                {/* ── New file upload ── */}
                                                <input
                                                    type="file"
                                                    id={`${key}File`}
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => handleFileChange(e, key)}
                                                />
                                                <label
                                                    htmlFor={`${key}File`}
                                                    className="flex border border-zinc-300 p-2 rounded-lg cursor-pointer justify-between items-center hover:border-teal-500 transition-colors"
                                                >
                                                    <span className="text-sm text-zinc-500 truncate max-w-[80%]">
                                                        {fileNames[key] && fileNames[key] !== "Existing File"
                                                            ? fileNames[key]
                                                            : existingDocs[key]
                                                                ? "Replace existing file…"
                                                                : "Browse file…"}
                                                    </span>
                                                    <Upload size={16} className="text-zinc-400 shrink-0" />
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>

                                    {/* ── Actions ── */}
                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="px-5 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
