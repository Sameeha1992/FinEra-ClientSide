import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    FileText,
    User,
    Building2,
    CalendarDays,
    ShieldCheck,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import AdminLayout from "@/components/layout/Adminlayout";
import { vendorVerificationList } from "@/api/admin/VendorVerification";
import type { VendorDetailData, VendorStatus } from "@/interfaces/admin/VendorVerification";
import { adminProfile } from "@/api/admin/admin.profile";
import type { adminData } from "@/api/admin/admin.profile";

// ─────────────────────────────────────────────
// Helper: status pill
// ─────────────────────────────────────────────
const StatusPill = ({ status }: { status: VendorDetailData["status"] }) => {
    const map: Record<
        VendorDetailData["status"],
        { label: string; bg: string; dot: string }
    > = {
        verified: {
            label: "Verified",
            bg: "bg-green-100 text-green-700",
            dot: "bg-green-500",
        },
        notVerified: {
            label: "Pending",
            bg: "bg-yellow-100 text-yellow-700",
            dot: "bg-yellow-400",
        },
        rejected: {
            label: "Rejected",
            bg: "bg-red-100 text-red-700",
            dot: "bg-red-500",
        },
    };
    const { label, bg, dot } = map[status] ?? map["notVerified"];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

// ─────────────────────────────────────────────
// Helper: info row
// ─────────────────────────────────────────────
const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value?: string | boolean | null;
}) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800">
            {value === undefined || value === null || value === ""
                ? "—"
                : String(value)}
        </p>
    </div>
);

// ─────────────────────────────────────────────
// Document card
// ─────────────────────────────────────────────
const DocCard = ({ label, url }: { label: string; url?: string }) => (
    <a
        href={url ?? "#"}
        target={url ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed
      ${url
                ? "border-teal-300 bg-teal-50 hover:bg-teal-100 cursor-pointer transition-colors"
                : "border-gray-200 bg-gray-50 cursor-not-allowed"
            }`}
    >
        <FileText size={28} className={url ? "text-teal-500" : "text-gray-300"} />
        <span
            className={`text-xs font-medium ${url ? "text-teal-600" : "text-gray-400"}`}
        >
            {label}
        </span>
        {!url && <span className="text-[10px] text-gray-400">Not uploaded</span>}
    </a>
);

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
const Toast = ({
    message,
    type,
}: {
    message: string;
    type: "success" | "error";
}) => (
    <div
        className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
      ${type === "success" ? "bg-teal-600" : "bg-red-500"}`}
    >
        {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
        {message}
    </div>
);

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const VendorDetailsVerification = () => {
    const { vendorId } = useParams<{ vendorId: string }>();
    const navigate = useNavigate();

    const [vendor, setVendor] = useState<VendorDetailData | null>(null);
    const [admin, setAdmin] = useState<adminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action: VendorStatus | null;
    }>({ open: false, action: null });

    // ── Fetch vendor + admin on mount ───────────
    useEffect(() => {
        if (!vendorId) return;

        const fetchAll = async () => {
            setLoading(true);
            try {
                const vendorData = await
                    vendorVerificationList.getVendorDetails(vendorId)
                setVendor(vendorData)



                console.log("data from the vendor side", vendorData);
            } catch (err) {
                console.error("Failed to load vendor details", err);
                showToast("Failed to load vendor details.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [vendorId]);

    // ── Toast helper ────────────────────────────
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Confirm + call verify API ────────────────
    const handleConfirmAction = async () => {
        if (!vendorId || !confirmModal.action) return;
        const action = confirmModal.action;
        setActionLoading(true);
        setConfirmModal({ open: false, action: null });
        try {
            await vendorVerificationList.updateVendorStatus(vendorId, action);
            setVendor((prev) =>
                prev ? { ...prev, status: action } : prev
            );
            const messages: Record<VendorStatus, string> = {
                verified: "Vendor has been verified successfully.",
                rejected: "Vendor has been rejected.",
                notVerified: "Vendor status reset to pending.",
            };
            showToast(
                messages[action],
                action === "verified" ? "success" : "error"
            );
        } catch (err) {
            console.error("Action failed", err);
            showToast("Action failed. Please try again.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    return (
        <AdminLayout>
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* ── Confirm Modal ── */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setConfirmModal({ open: false, action: null })}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col items-center gap-5">
                        <div
                            className={`flex items-center justify-center w-16 h-16 rounded-full ${confirmModal.action === "verified"
                                ? "bg-green-100"
                                : confirmModal.action === "notVerified"
                                    ? "bg-yellow-100"
                                    : "bg-red-100"
                                }`}
                        >
                            <AlertTriangle
                                size={32}
                                className={
                                    confirmModal.action === "verified"
                                        ? "text-green-500"
                                        : confirmModal.action === "notVerified"
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                }
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {confirmModal.action === "verified"
                                    ? "Verify this vendor?"
                                    : confirmModal.action === "notVerified"
                                        ? "Reset vendor to Pending?"
                                        : "Reject this vendor?"}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {confirmModal.action === "verified"
                                    ? "This will mark the vendor as verified and grant them access to the platform."
                                    : confirmModal.action === "notVerified"
                                        ? "This will reset the vendor's status back to pending review."
                                        : "This will reject the vendor's application. They will be notified."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => setConfirmModal({ open: false, action: null })}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${confirmModal.action === "verified"
                                    ? "bg-teal-500 hover:bg-teal-600"
                                    : confirmModal.action === "notVerified"
                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {confirmModal.action === "verified"
                                    ? "Yes, Verify"
                                    : confirmModal.action === "notVerified"
                                        ? "Yes, Reset"
                                        : "Yes, Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page Body ── */}
            <div className="space-y-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Verifications
                    </button>

                    {/* Admin Profile Strip */}
                    {admin && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
                                {admin.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800 leading-none">
                                    {admin.name}
                                </p>
                                <p className="text-xs text-gray-400">{admin.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                        <Loader2 size={36} className="animate-spin text-teal-500" />
                        <p className="text-sm">Loading vendor details…</p>
                    </div>
                ) : !vendor ? (
                    <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                        <XCircle size={36} className="text-gray-300" />
                        <p className="text-sm">Vendor not found.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Header Card ── */}
                        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                                    {vendor.vendorName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-xl font-bold text-gray-900">
                                            {vendor.vendorName}
                                        </h1>
                                        <StatusPill status={vendor.status} />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">{vendor.email}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Vendor ID:{" "}
                                        <span className="font-medium text-gray-600">
                                            #{vendor.vendorId}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Verify */}
                                <button
                                    disabled={vendor.status === "verified" || actionLoading}
                                    onClick={() =>
                                        setConfirmModal({ open: true, action: "verified" })
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <ShieldCheck size={15} />
                                    )}
                                    Verify
                                </button>

                                {/* Not Verified / Reset to Pending */}
                                <button
                                    disabled={vendor.status === "notVerified" || actionLoading}
                                    onClick={() =>
                                        setConfirmModal({ open: true, action: "notVerified" })
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <AlertTriangle size={15} />
                                    )}
                                    Pending
                                </button>

                                {/* Reject */}
                                <button
                                    disabled={vendor.status === "rejected" || actionLoading}
                                    onClick={() =>
                                        setConfirmModal({ open: true, action: "rejected" })
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <XCircle size={15} />
                                    )}
                                    Reject
                                </button>
                            </div>
                        </div>

                        {/* ── Detail Grid ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Business Information */}
                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Building2 size={18} className="text-teal-500" />
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Business Information
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <InfoRow label="Vendor Name" value={vendor.vendorName} />
                                    <InfoRow label="Email" value={vendor.email} />
                                    <InfoRow
                                        label="Registration Number"
                                        value={vendor.registrationNumber}
                                    />
                                    <InfoRow
                                        label="Licence Number"
                                        value={vendor.licenceNumber}
                                    />
                                </div>
                            </div>

                            {/* Account & System */}
                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <User size={18} className="text-teal-500" />
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Account & System
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <InfoRow
                                        label="Verification Status"
                                        value={
                                            vendor.status === "verified"
                                                ? "Verified"
                                                : vendor.status === "rejected"
                                                    ? "Rejected"
                                                    : "Pending"
                                        }
                                    />
                                    <InfoRow
                                        label="Account Status"
                                        value={
                                            vendor.accountStatus === "blocked"
                                                ? "Blocked"
                                                : "Unblocked"
                                        }
                                    />
                                    <InfoRow
                                        label="Profile Complete"
                                        value={vendor.isProfileComplete ? "Yes" : "No"}
                                    />
                                    <InfoRow label="Role" value={vendor.role} />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <CalendarDays size={18} className="text-teal-500" />
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Timeline
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <InfoRow
                                        label="Registered On"
                                        value={
                                            vendor.createdAt
                                                ? new Date(vendor.createdAt).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    },
                                                )
                                                : "—"
                                        }
                                    />
                                    <InfoRow
                                        label="Last Updated"
                                        value={
                                            vendor.updatedAt
                                                ? new Date(vendor.updatedAt).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    },
                                                )
                                                : "—"
                                        }
                                    />

                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <FileText size={18} className="text-teal-500" />
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Documents Submitted
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <DocCard
                                        label="Registration Document"
                                        url={vendor.registrationDoc}
                                    />
                                    <DocCard label="Licence Document" url={vendor.licenceDoc} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default VendorDetailsVerification;
