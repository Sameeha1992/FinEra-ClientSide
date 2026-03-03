import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, BadgeX, Percent, IndianRupee, Clock, AlertTriangle, User, Building2, FileText, ShieldCheck } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { loanProduct } from "@/api/loanProduct/loanProduct.service";
import type { LoanDetailForUserDto } from "@/interfaces/addLoan/loan.detail.dto";

// ── helpers ────────────────────────────────────────────────────────────────────
const formatAmount = (val: number) => {
    if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(0)} Cr`;
    if (val >= 100_000) return `₹${(val / 100_000).toFixed(0)} L`;
    if (val >= 1_000) return `₹${(val / 1_000).toFixed(0)} K`;
    return `₹${val}`;
};

// ── Sub-components ─────────────────────────────────────────────────────────────
interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}
const InfoCard = ({ icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="mt-0.5 w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

interface SectionProps {
    title: string;
    children: React.ReactNode;
}
const Section = ({ title, children }: SectionProps) => (
    <div className="mb-8">
        <h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-4 border-b border-teal-100 pb-2">
            {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const LoanDetailPage = () => {
    const { loanId } = useParams<{ loanId: string }>();
    const navigate = useNavigate();

    const { data: loan, isLoading, isError } = useQuery<LoanDetailForUserDto>({
        queryKey: ["loan-detail", loanId],
        queryFn: () => loanProduct.getLoanDetailsForUser(loanId!),
        enabled: !!loanId,
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Listings
                </button>

                {/* ── Loading ── */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400 text-sm gap-4">
                        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        <p>Loading loan details…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {isError && (
                    <div className="text-center py-32">
                        <AlertTriangle className="mx-auto text-red-400 mb-3" size={40} />
                        <p className="text-gray-500 text-sm">Failed to load loan details. Please go back and try again.</p>
                    </div>
                )}

                {/* ── Content ── */}
                {loan && !isLoading && (
                    <>
                        {/* Hero card */}
                        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    {/* Vendor name */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                                            {loan.vendor?.vendorName?.charAt(0)?.toUpperCase() ?? "B"}
                                        </div>
                                        <span className="text-white/80 text-sm font-medium">{loan.vendor?.vendorName}</span>
                                    </div>
                                    {/* Loan name */}
                                    <h1 className="text-2xl font-bold leading-snug mb-2">{loan.name}</h1>
                                    {/* Description */}
                                    {loan.description && (
                                        <p className="text-white/75 text-sm max-w-xl leading-relaxed">{loan.description}</p>
                                    )}
                                </div>

                                {/* Status badge */}
                                <div>
                                    {loan.status === "ACTIVE" ? (
                                        <span className="flex items-center gap-1.5 bg-green-400/20 border border-green-300/40 text-green-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                                            <BadgeCheck size={14} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 bg-red-400/20 border border-red-300/40 text-red-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                                            <BadgeX size={14} /> Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Quick stats strip */}
                            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-5">
                                <div className="text-center">
                                    <p className="text-white/60 text-xs mb-1">Interest Rate</p>
                                    <p className="text-2xl font-extrabold">{loan.interestRate}%</p>
                                    <p className="text-white/60 text-xs">per annum</p>
                                </div>
                                <div className="text-center border-l border-r border-white/20">
                                    <p className="text-white/60 text-xs mb-1">Loan Amount</p>
                                    <p className="text-xl font-extrabold">
                                        {formatAmount(loan.amount.minimum)} – {formatAmount(loan.amount.maximum)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/60 text-xs mb-1">Tenure</p>
                                    <p className="text-xl font-extrabold">
                                        {loan.tenure.minimum} – {loan.tenure.maximum}
                                    </p>
                                    <p className="text-white/60 text-xs">months</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Loan Details ── */}
                        <Section title="Loan Details">
                            <InfoCard
                                icon={<Percent size={16} />}
                                label="Interest Rate"
                                value={`${loan.interestRate}% p.a.`}
                            />
                            <InfoCard
                                icon={<IndianRupee size={16} />}
                                label="Loan Amount Range"
                                value={`${formatAmount(loan.amount.minimum)} – ${formatAmount(loan.amount.maximum)}`}
                            />
                            <InfoCard
                                icon={<Clock size={16} />}
                                label="Tenure Range"
                                value={`${loan.tenure.minimum} – ${loan.tenure.maximum} months`}
                            />
                            <InfoCard
                                icon={<AlertTriangle size={16} />}
                                label="Due Penalty"
                                value={`${loan.duePenalty}%`}
                            />
                        </Section>

                        {/* ── Eligibility ── */}
                        {loan.eligibility && (
                            <Section title="Eligibility Criteria">
                                {loan.eligibility.minAge !== undefined && (
                                    <InfoCard
                                        icon={<User size={16} />}
                                        label="Minimum Age"
                                        value={`${loan.eligibility.minAge} years`}
                                    />
                                )}
                                {loan.eligibility.maxAge !== undefined && (
                                    <InfoCard
                                        icon={<User size={16} />}
                                        label="Maximum Age"
                                        value={`${loan.eligibility.maxAge} years`}
                                    />
                                )}
                                {loan.eligibility.minSalary !== undefined && (
                                    <InfoCard
                                        icon={<IndianRupee size={16} />}
                                        label="Minimum Monthly Salary"
                                        value={formatAmount(loan.eligibility.minSalary)}
                                    />
                                )}
                                {loan.eligibility.minCibilScore !== undefined && (
                                    <InfoCard
                                        icon={<ShieldCheck size={16} />}
                                        label="Minimum CIBIL Score"
                                        value={loan.eligibility.minCibilScore}
                                    />
                                )}
                            </Section>
                        )}

                        {/* ── Vendor Info ── */}
                        <Section title="Provider Information">
                            <InfoCard
                                icon={<Building2 size={16} />}
                                label="Bank / Institution"
                                value={loan.vendor?.vendorName ?? "—"}
                            />
                            <InfoCard
                                icon={<FileText size={16} />}
                                label="Loan ID"
                                value={
                                    <span className="font-mono text-xs text-gray-600">{loan.loanId}</span>
                                }
                            />
                        </Section>

                        {/* ── Apply CTA ── */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => navigate(-1)}
                                className="mr-3 px-6 py-2.5 border border-teal-600 text-teal-600 text-sm font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                            >
                                Back
                            </button>
                           
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default LoanDetailPage;
