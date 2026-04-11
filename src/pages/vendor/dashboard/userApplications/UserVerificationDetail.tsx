import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import {
  ArrowLeft,
  User,
  FileText,
  Briefcase,
  Home,
  Gem,
  Building2,
  CalendarDays,
  BadgeCheck,
  IndianRupee,
  Clock,
  AlertCircle,
  Loader2,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ChevronRight,
} from "lucide-react";
import type { VendorApplicationDetailsData } from "@/interfaces/vendor/user.verification.interface";
import { userVerification } from "@/api/vendor/user.verification";
import { EmiService } from "@/api/emi/emi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatButton from "@/components/chat/ChatButton";
import type { EmiListByLoanIdType } from "@/interfaces/emi/emi.list.interface";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n?: number) =>
  n !== undefined ? "₹" + n.toLocaleString("en-IN") : "—";

const fmtDate = (d?: string | Date) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyle = (s: string) => {
  const u = s?.toUpperCase();
  if (u === "APPROVED")
    return {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Approved",
    };
  if (u === "PENDING")
    return {
      bg: "bg-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    };
  if (u === "REJECTED")
    return {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Rejected",
    };
  return {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: s,
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600">
        {icon}
      </span>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-sm font-medium text-slate-800">
      {value !== undefined && value !== null && value !== ""
        ? String(value)
        : "—"}
    </p>
  </div>
);

const DocCard = ({ label, url }: { label: string; url?: string }) => (
  <a
    href={url || "#"}
    target={url ? "_blank" : undefined}
    rel="noopener noreferrer"
    className={[
      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors",
      url
        ? "border-teal-300 bg-teal-50 hover:bg-teal-100 cursor-pointer"
        : "border-slate-200 bg-slate-50 cursor-not-allowed",
    ].join(" ")}
  >
    <FileText size={26} className={url ? "text-teal-500" : "text-slate-300"} />
    <span
      className={
        "text-xs font-medium text-center " +
        (url ? "text-teal-600" : "text-slate-400")
      }
    >
      {label}
    </span>
    {!url && <span className="text-[10px] text-slate-400">Not uploaded</span>}
  </a>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserVerificationDetail() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  const [data, setData] = useState<VendorApplicationDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Action state — mock only, wire up real API later
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    reason: "",
  });

  // ── Fetch detail ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!applicationId) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await userVerification.getAApplicationDetail(applicationId);
        console.log("FRONTEND RECEIVED DATA:", res);
        setData(res);
      } catch (err) {
        console.error("Failed to load application detail", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicationId]);

  // ── Fetch EMI Schedule via TanStack Query ────────────────────────────────
  const { data: emiData, isLoading: emiLoading } = useQuery({
    queryKey: ["loanEmis", applicationId],
    queryFn: () => EmiService.getEmisByLoanId(applicationId as string),
    enabled: !!applicationId,
  });

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleStatusUpdate = async () => {
    if (!applicationId) return;
    setActionLoading(true);
    try {
      const res = await userVerification.approveLoan(applicationId);
      setData((prev) => (prev ? { ...prev, status: "APPROVED" } : prev));
      toast.success(res.message || "Application approved successfully!");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to approve application.")
        : "Failed to approve application.";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleReject = async () => {
    const reason = rejectionModal.reason.trim();
    if (!reason || !applicationId) return;
    setActionLoading(true);
    setRejectionModal({ open: false, reason: "" });
    try {
      const res = await userVerification.rejectLoan(applicationId, reason);
      setData((prev) =>
        prev ? { ...prev, status: "REJECTED", rejectionReason: reason } : prev,
      );
      toast.success(res.message || "Application rejected.");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to reject application.")
        : "Failed to reject application.";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-56 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-teal-500" />
            <p className="text-sm text-slate-400">
              Loading application details…
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── Error / Not Found ─────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-56 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <XCircle size={36} className="text-slate-300" />
            <p className="text-slate-500 font-medium">Application not found.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 text-sm text-teal-600 hover:underline"
            >
              ← Back to list
            </button>
          </div>
        </main>
      </div>
    );
  }

  const s = statusStyle(data.status);

  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 ml-56 p-8 space-y-6">
          {/* ── Back Button ── */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to User List
          </button>

          {/* ── Hero Header Card ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-teal-500 to-teal-400" />
            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 font-bold text-2xl shrink-0">
                  {data.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-800">
                      {data.user.name}
                    </h1>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold " +
                        s.bg +
                        " " +
                        s.text
                      }
                    >
                      <span className={"w-1.5 h-1.5 rounded-full " + s.dot} />
                      {s.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {data.user.email}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    App #{" "}
                    <span className="font-mono font-semibold text-slate-600">
                      {data.applicationNumber}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right side: meta pills + action buttons */}
              <div className="flex flex-col gap-3 items-end shrink-0">
                {/* Info pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    <IndianRupee size={12} />
                    {fmt(data.loanAmount)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    <CalendarDays size={12} />
                    {data.loanTenure} months
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                    <Briefcase size={12} />
                    {data.loanType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    <Clock size={12} />
                    Applied {fmtDate(data.appliedDate)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 items-center">
                  <ChatButton
                    applicationId={applicationId as string}
                    viewerRole="vendor"
                  />

                  <button
                    disabled={actionLoading || data.status === "APPROVED"}
                    onClick={() => handleStatusUpdate()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-fit"
                  >
                    {actionLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                    Approve
                  </button>

                  <button
                    disabled={actionLoading || data.status === "REJECTED"}
                    onClick={() =>
                      setRejectionModal({ open: true, reason: "" })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-fit"
                  >
                    {actionLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Grid Row 1: Loan Application Details + Applicant Profile ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              icon={<IndianRupee size={16} />}
              title="Loan Application Details"
            >
              <div className="grid grid-cols-2 gap-5">
                <InfoRow label="Loan Type" value={data.loanType} />
                <InfoRow label="Loan Amount" value={fmt(data.loanAmount)} />
                <InfoRow label="Tenure" value={data.loanTenure + " months"} />
                <InfoRow label="Employment Type" value={data.employmentType} />
                <InfoRow
                  label="Monthly Income"
                  value={fmt(data.monthlyIncome)}
                />
                <InfoRow label="Phone" value={data.phoneNumber} />
                <InfoRow
                  label="Applied Date"
                  value={fmtDate(data.appliedDate)}
                />
                <InfoRow label="Status" value={s.label} />
                {data.rejectionReason ? (
                  <div className="col-span-2">
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                      <AlertCircle
                        size={15}
                        className="text-red-500 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wide mb-0.5">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-700">
                          {data.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </Section>

            <Section icon={<User size={16} />} title="Applicant Profile">
              <div className="grid grid-cols-2 gap-5">
                <InfoRow label="Full Name" value={data.user.name} />
                <InfoRow label="Email" value={data.user.email} />
                <InfoRow label="Phone" value={data.user.phone} />
                <InfoRow label="Gender" value={data.user.gender} />
                <InfoRow label="Date of Birth" value={fmtDate(data.user.dob)} />
                <InfoRow label="Occupation" value={data.user.job} />
                <InfoRow
                  label="Income"
                  value={
                    data.user.income
                      ? "₹" + Number(data.user.income).toLocaleString("en-IN")
                      : undefined
                  }
                />
                <InfoRow label="Customer ID" value={data.user.customerId} />
              </div>
            </Section>
          </div>

          {/* ── Grid Row 2: Loan Product + KYC ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section icon={<BadgeCheck size={16} />} title="KYC Information">
              <div className="grid grid-cols-2 gap-5 mb-5">
                <InfoRow
                  label="Aadhaar Number"
                  value={data.user.adhaarNumber}
                />
                <InfoRow label="PAN Number" value={data.user.panNumber} />
                <InfoRow label="CIBIL Score" value={data.user.cibilScore} />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                KYC Documents
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DocCard label="Aadhaar Document" url={data.user.adhaarDoc} />
                <DocCard label="PAN Document" url={data.user.panDoc} />
                {data.user.cibilDoc && (
                  <DocCard label="CIBIL Report" url={data.user.cibilDoc} />
                )}
                {data.user.additionalDoc && (
                  <DocCard
                    label="Additional Doc"
                    url={data.user.additionalDoc}
                  />
                )}
              </div>
            </Section>
          </div>

          {/* ── Personal Loan Details — only if it has actual data ── */}
          {(data.personalDetails?.employerName ||
            data.personalDetails?.purpose ||
            data.personalDetails?.salarySlipUrl) && (
              <Section
                icon={<Briefcase size={16} />}
                title="Personal Loan Details"
              >
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Loan Document
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DocCard
                    label="Salary Slip"
                    url={data.personalDetails?.salarySlipUrl}
                  />
                </div>
              </Section>
            )}

          {/* ── Gold Loan Details — only if it has actual data ── */}
          {(data.goldDetails?.goldWeight || data.goldDetails?.goldImageUrl) && (
            <Section icon={<Gem size={16} />} title="Gold Loan Details">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                <InfoRow
                  label="Gold Weight (g)"
                  value={data.goldDetails?.goldWeight}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Loan Document
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <DocCard
                  label="Gold Image"
                  url={data.goldDetails?.goldImageUrl}
                />
              </div>
            </Section>
          )}

          {/* ── Home Loan Details — only if it has actual data ── */}
          {(data.homeDetails?.propertyValue ||
            data.homeDetails?.propertyLocation ||
            data.homeDetails?.propertyDocUrl) && (
              <Section icon={<Home size={16} />} title="Home Loan Details">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                  <InfoRow
                    label="Property Value"
                    value={fmt(data.homeDetails?.propertyValue)}
                  />
                  <InfoRow
                    label="Property Location"
                    value={data.homeDetails?.propertyLocation}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Loan Document
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DocCard
                    label="Property Document"
                    url={data.homeDetails?.propertyDocUrl}
                  />
                </div>
              </Section>
            )}

          {/* ── Business Loan Details — only if it has actual data ── */}
          {(data.businessDetails?.businessName ||
            data.businessDetails?.annualRevenue ||
            data.businessDetails?.registrationDocUrl) && (
              <Section
                icon={<Building2 size={16} />}
                title="Business Loan Details"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                  <InfoRow
                    label="Business Name"
                    value={data.businessDetails?.businessName}
                  />
                  <InfoRow
                    label="Annual Revenue"
                    value={fmt(data.businessDetails?.annualRevenue)}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Loan Document
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DocCard
                    label="Registration Doc"
                    url={data.businessDetails?.registrationDocUrl}
                  />
                </div>
              </Section>
            )}
          {/* ── EMI Schedule Section ── */}
          <div className="mt-8">
            {(() => {
              if (emiLoading) {
                return (
                  <Section title="EMI Schedule" icon={<Calendar size={16} />}>
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-teal-600 w-8 h-8" />
                    </div>
                  </Section>
                );
              }
              const hasRealData = !!(emiData?.emis && emiData.emis.length > 0);
              const tenure = hasRealData
                ? emiData!.emis.length
                : (data?.loanTenure || 12); // Fallback to 12 if tenure is undefined

              const loanAmount = data?.loanAmount || 0; // Fallback to 0 if amount is undefined

              // Explicitly type displayData as an array of EmiListByLoanIdType
              const displayData: EmiListByLoanIdType[] = hasRealData
                ? emiData!.emis
                : Array.from({ length: Math.min(tenure, 6) }).map((_, i) => ({
                  loan: applicationId || "preview",
                  emiNumber: i + 1,
                  dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
                  amount: loanAmount > 0
                    ? Math.round(loanAmount / tenure + (loanAmount * 0.1) / 12)
                    : 0,
                  status: (i === 0 ? "PENDING" : "UPCOMING") as "PENDING" | "UPCOMING",
                }));

              return (
                <Section
                  title={
                    hasRealData ? "EMI Schedule" : "EMI Schedule (Preview)"
                  }
                  icon={<Calendar size={16} />}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-500">
                        Total Tenure
                      </span>
                      <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                        {tenure} Months
                      </span>
                    </div>

                    <div className="space-y-3 relative overflow-x-auto">
                      <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          EMI No.
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Due Date
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Amount
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                          Action
                        </span>
                      </div>

                      <div className="space-y-3">
                        {displayData.slice(0, 6).map((emi: EmiListByLoanIdType, index: number, arr: EmiListByLoanIdType[]) => {
                          const firstPendingIndex = arr.findIndex(
                            (e: any) => e.status === "PENDING",
                          );
                          const isFirstPending = index === firstPendingIndex;

                          return (
                            <div
                              key={emi.emiNumber}
                              className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-teal-100 transition-all group"
                            >
                              <div className="flex items-center gap-3 col-span-1">
                                <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm border border-teal-100 shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                  {emi.emiNumber}
                                </div>
                                <span className="sm:hidden text-sm font-bold text-slate-900">
                                  EMI {emi.emiNumber}
                                </span>
                              </div>

                              <div className="col-span-1 flex justify-between sm:block">
                                <span className="sm:hidden text-xs font-medium text-slate-500 uppercase">
                                  Due Date
                                </span>
                                <span className="text-sm font-semibold text-slate-700">
                                  {new Date(emi.dueDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              </div>

                              <div className="col-span-1 flex justify-between sm:block">
                                <span className="sm:hidden text-xs font-medium text-slate-500 uppercase">
                                  Amount
                                </span>
                                <span className="text-sm font-black text-slate-900">
                                  ₹ {emi.amount.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <div className="col-span-1 flex justify-between sm:block">
                                <span className="sm:hidden text-xs font-medium text-slate-500 uppercase">
                                  Status
                                </span>
                                <span
                                  className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${emi.status === "PENDING"
                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                    : emi.status === "PAID"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      : emi.status === "UPCOMING"
                                        ? "bg-teal-50 text-teal-600 border-teal-200"
                                        : "bg-slate-50 text-slate-500 border-slate-200"
                                    }`}
                                >
                                  {emi.status}
                                </span>
                              </div>

                              <div className="col-span-1 flex justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-50 sm:border-0 relative">
                                {emi.status === "PAID" ? (
                                  <span className="text-xs font-semibold text-slate-400 flex items-center justify-center w-full sm:w-auto px-3 py-1.5">
                                    —
                                  </span>
                                ) : isFirstPending ? (
                                  <button
                                    className="flex items-center gap-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-lg transition-colors w-full sm:w-auto justify-center shadow-sm shadow-teal-200"
                                    onClick={() =>
                                      console.log(
                                        "Vendor View EMI",
                                        emi.emiNumber,
                                      )
                                    }
                                  >
                                    View Details
                                    <ChevronRight size={14} />
                                  </button>
                                ) : (
                                  <span
                                    className="text-xs font-semibold text-slate-400 flex items-center justify-center w-full sm:w-auto px-3 py-1.5 cursor-not-allowed"
                                    title="Locked"
                                  >
                                    —
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Section>
              );
            })()}
          </div>
        </main>
      </div>

      {/* ── Rejection Reason Modal ── */}
      {rejectionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setRejectionModal({ open: false, reason: "" })}
          />
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 shrink-0">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Reject Application?
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Please provide a reason so the applicant is informed.
                </p>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Insufficient income, documents invalid…"
                value={rejectionModal.reason}
                onChange={(e) =>
                  setRejectionModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition"
              />
              {rejectionModal.reason.trim() === "" && (
                <p className="text-xs text-red-400">
                  A reason is required to reject this application.
                </p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRejectionModal({ open: false, reason: "" })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectionModal.reason.trim() === ""}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
