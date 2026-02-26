import { ClipboardList } from "lucide-react";
import PersonalLoanForm from "@/features/userLoans/PersonalLoanForm";

/**
 * PersonalLoanPage
 *
 * Renders the Personal Loan application screen.
 * - No backend calls — form data is logged to console on submit.
 * - `userProfile` would normally be read from your Redux / Auth context.
 *   Replace the hardcoded values with real user data when integrating.
 */
const PersonalLoanPage = () => {
    // TODO: Replace with actual user data from auth context / Redux store
    const userProfile = {
        fullName: "",
        email: "",
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <ClipboardList size={20} className="text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Apply for Personal Loan
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Fill in the details below. All verified KYC information is
                            pre-filled from your profile.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Form Container ── */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Info Banner */}
                <div className="mb-6 flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3">
                    <span className="text-teal-500 text-lg leading-none mt-0.5">ℹ️</span>
                    <p className="text-sm text-teal-700">
                        Fields marked with{" "}
                        <span className="text-red-500 font-semibold">*</span> are required.
                        Your KYC details (Aadhaar, PAN) are already on file and will be
                        verified automatically.
                    </p>
                </div>

                {/* Form */}
                <PersonalLoanForm/>
            </div>
        </div>
    );
};

export default PersonalLoanPage;
