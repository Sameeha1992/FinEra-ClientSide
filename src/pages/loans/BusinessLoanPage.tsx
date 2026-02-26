import { Briefcase } from "lucide-react";
import BusinessLoanForm from "@/features/userLoans/BusinessLoanForm";

/**
 * BusinessLoanPage
 *
 * Renders the Business Loan application screen.
 * - No backend calls — form data is logged to console on submit.
 * - fullName & email will be sourced from auth context once backend is ready.
 */
const BusinessLoanPage = () => {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <Briefcase size={20} className="text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Apply for Business Loan
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Fuel your business growth with quick approvals and flexible repayment options.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Form Container ── */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Info Banner */}
                <div className="mb-6 flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                    <span className="text-purple-500 text-lg leading-none mt-0.5">ℹ️</span>
                    <p className="text-sm text-purple-800">
                        Fields marked with{" "}
                        <span className="text-red-500 font-semibold">*</span> are required.
                        Make sure your business registration document is valid and legible
                        before uploading.
                    </p>
                </div>

                {/* Form */}
                <BusinessLoanForm />
            </div>
        </div>
    );
};

export default BusinessLoanPage;
