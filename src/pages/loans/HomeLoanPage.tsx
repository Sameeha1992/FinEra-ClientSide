import { Home } from "lucide-react";
import HomeLoanForm from "@/features/userLoans/HomeLoanForm";

/**
 * HomeLoanPage
 *
 * Renders the Home Loan application screen.
 * - No backend calls — form data is logged to console on submit.
 * - fullName & email will be sourced from auth context once backend is ready.
 */
const HomeLoanPage = () => {
    return (
        <div className="min-h-screen bg-slate-100">
            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Home size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Apply for Home Loan
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Turn your dream home into reality with competitive interest rates and flexible tenures.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Form Container ── */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Info Banner */}
                <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <span className="text-blue-500 text-lg leading-none mt-0.5">ℹ️</span>
                    <p className="text-sm text-blue-800">
                        Fields marked with{" "}
                        <span className="text-red-500 font-semibold">*</span> are required.
                        Ensure your property documents are up to date — our team will
                        verify all details before processing your loan.
                    </p>
                </div>

                {/* Form */}
                <HomeLoanForm />
            </div>
        </div>
    );
};

export default HomeLoanPage;
