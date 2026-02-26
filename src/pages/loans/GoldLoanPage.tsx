import { Gem } from "lucide-react";
import GoldLoanForm from "@/features/userLoans/GoldLoanForm";

/**
 * GoldLoanPage
 *
 * Renders the Gold Loan application screen.
 * - No backend calls — form data is logged to console on submit.
 * - fullName & email will be sourced from auth context once backend is ready.
 */
const GoldLoanPage = () => {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                        <Gem size={20} className="text-yellow-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Apply for Gold Loan
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Pledge your gold and get instant funds at competitive interest rates.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Form Container ── */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Info Banner */}
                <div className="mb-6 flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                    <span className="text-yellow-500 text-lg leading-none mt-0.5">ℹ️</span>
                    <p className="text-sm text-yellow-800">
                        Fields marked with{" "}
                        <span className="text-red-500 font-semibold">*</span> are required.
                        Ensure the gold image is clear and the weight is accurate — our team
                        will verify the details before processing your loan.
                    </p>
                </div>

                {/* Form */}
                <GoldLoanForm />
            </div>
        </div>
    );
};

export default GoldLoanPage;
