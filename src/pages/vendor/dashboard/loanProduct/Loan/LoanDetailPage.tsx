import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../../../components/vendor/dashboard/shared/Sidebar";
import {
    ArrowLeft,
    Info,
    DollarSign,
    Clock,
    Percent,
    UserCheck,
    AlertCircle,
    FileText,
    CheckCircle2
} from "lucide-react";
import { loanProduct } from "@/api/loanProduct/loanProduct.service";
import type { ILoanProductDto } from "@/interfaces/addLoan/loanProduct.dto";
import toast from "react-hot-toast";

export default function LoanDetailPage() {
    const { loanId } = useParams<{ loanId: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<ILoanProductDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoanDetail = async () => {
            if (!loanId) return;
            try {
                setLoading(true);
                const data = await loanProduct.getLoanDetails(loanId);
                console.log("detail page of ther loan",data)
                setLoan(data);
            } catch (error) {
                console.error("Error fetching loan details:", error);
                toast.error("Failed to load loan details");
            } finally {
                setLoading(false);
            }
        };

        fetchLoanDetail();
    }, [loanId]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 ml-56 p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 ml-56 p-8 flex flex-col items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">Loan Product Not Found</h2>
                    <button
                        onClick={() => navigate("/vendor/loans")}
                        className="mt-4 text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Loans
                    </button>
                </div>
            </div>
        );
    }

    const DetailItem = ({ label, value, icon: Icon, className = "" }: { label: string, value: React.ReactNode, icon: any, className?: string }) => (
        <div className={`p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 ${className}`}>
            <div className="p-2.5 bg-slate-50 rounded-lg text-teal-600">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <div className="text-slate-700 font-medium">{value}</div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 ml-56 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/vendor/loans")}
                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                            >
                                <ArrowLeft className="text-slate-600" size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{loan.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600 px-2 py-0.5 bg-teal-50 rounded">
                                        {loan.loanType}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${loan.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                        }`}>
                                        {loan.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/vendor/edit-loans/${loanId}`)}
                            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors shadow-sm shadow-teal-500/20"
                        >
                            Edit Product
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Description Section - Full Width */}
                        <div className="md:col-span-2 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                                <FileText size={18} className="text-teal-600" />
                                <h2>Loan Description</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {loan.description || "No description provided for this loan product."}
                            </p>
                        </div>

                        {/* Financial Details */}
                        <div className="space-y-6">
                            <h3 className="text-slate-800 font-bold flex items-center gap-2">
                                <DollarSign size={18} className="text-teal-600" />
                                Financial Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem
                                    label="Minimum Amount"
                                    value={`₹${loan.amount.minimum.toLocaleString()}`}
                                    icon={DollarSign}
                                />
                                <DetailItem
                                    label="Maximum Amount"
                                    value={`₹${loan.amount.maximum.toLocaleString()}`}
                                    icon={DollarSign}
                                />
                                <DetailItem
                                    label="Interest Rate"
                                    value={`${loan.interestRate}% P.A.`}
                                    icon={Percent}
                                />
                                <DetailItem
                                    label="Processing Fee"
                                    value={`₹${loan.processingFee}`}
                                    icon={Info}
                                />
                                <DetailItem
                                    label="Late Payment Penalty"
                                    value={`₹${loan.duePenalty}`}
                                    icon={AlertCircle}
                                />
                            </div>
                        </div>

                        {/* Tenure & Eligibility */}
                        <div className="space-y-6">
                            <h3 className="text-slate-800 font-bold flex items-center gap-2">
                                <Clock size={18} className="text-teal-600" />
                                Tenure & Eligibility
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem
                                    label="Tenure Range"
                                    value={`${loan.tenure.minimum} - ${loan.tenure.maximum} Months`}
                                    icon={Clock}
                                />
                                {loan.eligibility && (
                                    <>
                                        <DetailItem
                                            label="Age Criteria"
                                            value={`${loan.eligibility.minAge} - ${loan.eligibility.maxAge} Years`}
                                            icon={UserCheck}
                                        />
                                        <DetailItem
                                            label="Min. Monthly Salary"
                                            value={`₹${loan.eligibility.minSalary!.toLocaleString()}`}
                                            icon={DollarSign}
                                        />
                                        <DetailItem
                                            label="Min. CIBIL Score"
                                            value={loan.eligibility?.minCibilScore}
                                            icon={CheckCircle2}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
