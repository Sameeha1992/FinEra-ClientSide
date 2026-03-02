import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { RootState } from "@/redux/store";
import { goldLoanSchema } from "./goldLoanSchema";
import type { GoldLoanFormValues } from "./goldLoanSchema";
import { LoanApplication } from "@/api/loanApplication/loan.application";

import CommonLoanFields from "@/components/loanForms/CommonLoanFields";
import InputField from "@/components/loanForms/InputField";
import FileUploadField from "@/components/loanForms/FileUploadField";
import FormSection from "@/components/loanForms/FormSection";
import SubmitButton from "@/components/loanForms/SubmitButton";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GoldLoanForm = () => {
    // ── Auth & Route params ──────────────────────────────────────────────────
    const { name, email, Id: userId } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanProductId = searchParams.get("loanId") ?? "";
    const vendorId = searchParams.get("vendorId") ?? "";
    const loanType = (searchParams.get("loanType") ?? "GOLD") as "GOLD";

    // ── Loan Product Limits (from listing page) ──────────────────────────────
    const limits = {
        minAmount: Number(searchParams.get("minAmount")) || undefined,
        maxAmount: Number(searchParams.get("maxAmount")) || undefined,
        minTenure: Number(searchParams.get("minTenure")) || undefined,
        maxTenure: Number(searchParams.get("maxTenure")) || undefined,
        minSalary: Number(searchParams.get("minSalary")) || undefined,
    };

    // ── Form Setup ───────────────────────────────────────────────────────────
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<GoldLoanFormValues>({
        resolver: zodResolver(goldLoanSchema),
    });

    // ── Submit Handler ───────────────────────────────────────────────────────
    const onSubmit = async (data: GoldLoanFormValues) => {
        if (!userId) {
            toast.error("User session expired. Please log in again.");
            return;
        }

        try {
            await LoanApplication.createLoanApplication(
                {
                    userId,
                    vendorId,
                    loanProductId,
                    loanType,
                    phoneNumber: data.phoneNumber,
                    employmentType: data.employmentType,
                    monthlyIncome: data.monthlyIncome,
                    loanAmount: data.loanAmount,
                    loanTenure: data.loanTenure,
                    goldDetails: {
                        goldWeight: data.goldWeight,
                    },
                },
                {
                    goldImage: data.goldImage,
                },
            );

            toast.success("Gold loan application submitted successfully!");
            navigate("/user/loans");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ?? "Failed to submit application. Please try again.";
            toast.error(message);
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
        >
            {/* ── Section 1: Applicant & Loan Details ── */}
            <FormSection
                title="Applicant & Loan Details"
                description="Basic information about you and the loan you're applying for."
            >
                {/* CommonLoanFields renders bare fields that slot into FormSection's grid */}
                <CommonLoanFields<GoldLoanFormValues>
                    register={register}
                    control={control}
                    errors={errors}
                    fullName={name}
                    email={email}
                    limits={limits}
                />
            </FormSection>

            {/* ── Section 2: Gold Details ── */}
            <FormSection
                title="Gold Details"
                description="Provide details about the gold you are pledging as collateral."
            >
                {/* Gold Weight */}
                <InputField<GoldLoanFormValues>
                    name="goldWeight"
                    label="Gold Weight (grams)"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="e.g. 20"
                    hint="Total weight of gold items in grams"
                    rules={{}}
                />

                {/* Gold Image Upload — full width */}
                <div className="md:col-span-2">
                    <FileUploadField<GoldLoanFormValues>
                        name="goldImage"
                        label="Gold Image"
                        control={control}
                        errors={errors}
                        accept=".jpg,.jpeg,.png,.webp"
                        hint="Upload a clear photo of the gold item(s) — JPG, PNG, or WebP"
                    />
                </div>
            </FormSection>

            {/* ── Submit ── */}
            <SubmitButton
                label="Submit Application"
                loadingLabel="Submitting…"
                isLoading={isSubmitting}
            />
        </form>
    );
};

export default GoldLoanForm;
