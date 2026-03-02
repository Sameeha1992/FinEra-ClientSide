import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { RootState } from "@/redux/store";
import { businessLoanSchema } from "./businessLoanSchema";
import type { BusinessLoanFormValues } from "./businessLoanSchema";
import { LoanApplication } from "@/api/loanApplication/loan.application";

import CommonLoanFields from "@/components/loanForms/CommonLoanFields";
import InputField from "@/components/loanForms/InputField";
import SelectField from "@/components/loanForms/SelectField";
import FileUploadField from "@/components/loanForms/FileUploadField";
import FormSection from "@/components/loanForms/FormSection";
import SubmitButton from "@/components/loanForms/SubmitButton";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUSINESS_TYPE_OPTIONS = [
    { label: "Sole Proprietorship", value: "sole_proprietorship" },
    { label: "Partnership", value: "partnership" },
    { label: "Private Limited (Pvt Ltd)", value: "private_limited" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BusinessLoanForm = () => {
    // ── Auth & Route params ─────────────────────────────────────────────────────
    const { name, email, Id: userId } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanProductId = searchParams.get("loanId") ?? "";
    const vendorId = searchParams.get("vendorId") ?? "";
    const loanType = (searchParams.get("loanType") ?? "BUSINESS") as "BUSINESS";

    // ── Loan Product Limits (from listing page) ─────────────────────────────────
    const limits = {
        minAmount: Number(searchParams.get("minAmount")) || undefined,
        maxAmount: Number(searchParams.get("maxAmount")) || undefined,
        minTenure: Number(searchParams.get("minTenure")) || undefined,
        maxTenure: Number(searchParams.get("maxTenure")) || undefined,
        minSalary: Number(searchParams.get("minSalary")) || undefined,
    };

    // ── Form Setup ──────────────────────────────────────────────────────────────
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(businessLoanSchema),
    });

    // ── Submit Handler ──────────────────────────────────────────────────────────
    const onSubmit = async (data: BusinessLoanFormValues) => {
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
                    businessDetails: {
                        businessName: data.businessName,
                        businessType: data.businessType,
                        annualRevenue: data.annualRevenue,
                    },
                },
                {
                    registerationDoc: data.businessRegistrationDoc,
                },
            );

            toast.success("Business loan application submitted successfully!");
            navigate("/user/loans");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ?? "Failed to submit application. Please try again.";
            toast.error(message);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
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
                <CommonLoanFields<BusinessLoanFormValues>
                    register={register}
                    control={control}
                    errors={errors}
                    fullName={name}
                    email={email}
                    limits={limits}
                />
            </FormSection>

            {/* ── Section 2: Business Details ── */}
            <FormSection
                title="Business Details"
                description="Provide details about your business to help assess the loan eligibility."
            >
                {/* Business Name */}
                <InputField<BusinessLoanFormValues>
                    name="businessName"
                    label="Business Name"
                    register={register}
                    errors={errors}
                    placeholder="e.g. Krishna Traders"
                    rules={{ required: "Business name is required" }}
                />

                {/* Business Type */}
                <SelectField<BusinessLoanFormValues>
                    name="businessType"
                    label="Business Type"
                    options={BUSINESS_TYPE_OPTIONS}
                    register={register}
                    errors={errors}
                    placeholder="Select business type"
                    rules={{ required: "Please select your business type" }}
                />

                {/* Annual Revenue */}
                <InputField<BusinessLoanFormValues>
                    name="annualRevenue"
                    label="Annual Revenue (₹)"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="e.g. 2000000"
                    hint="Total revenue earned by your business in the last financial year"
                    rules={{ required: "Annual revenue is required" }}
                />

                {/* Business Registration Document — full width */}
                <div className="md:col-span-2">
                    <FileUploadField<BusinessLoanFormValues>
                        name="businessRegistrationDoc"
                        label="Business Registration Document"
                        control={control}
                        errors={errors}
                        accept=".pdf,.jpg,.jpeg,.png"
                        hint="Upload your GST certificate, trade license, or incorporation document (PDF or image)"
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

export default BusinessLoanForm;
