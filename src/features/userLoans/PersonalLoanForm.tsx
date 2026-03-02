import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { RootState } from "@/redux/store";
import { personalLoanSchema } from "./personalLoanSchema";
import type { PersonalLoanFormValues } from "./personalLoanSchema";
import { LoanApplication } from "@/api/loanApplication/loan.application";

import CommonLoanFields from "@/components/loanForms/CommonLoanFields";
import InputField from "@/components/loanForms/InputField";
import TextAreaField from "@/components/loanForms/TextAreaField";
import FileUploadField from "@/components/loanForms/FileUploadField";
import FormSection from "@/components/loanForms/FormSection";
import SubmitButton from "@/components/loanForms/SubmitButton";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PersonalLoanForm = () => {
    // ── Auth & Route params ──────────────────────────────────────────────────
    const { name, email, Id: userId } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanProductId = searchParams.get("loanId") ?? "";
    const vendorId = searchParams.get("vendorId") ?? "";
    const loanType = (searchParams.get("loanType") ?? "PERSONAL") as "PERSONAL";

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
    } = useForm<PersonalLoanFormValues>({
        resolver: zodResolver(personalLoanSchema),
    });

    // ── Submit Handler ───────────────────────────────────────────────────────
    const onSubmit = async (data: PersonalLoanFormValues) => {
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
                    personalDetails: {
                        employerName: data.employerName,
                        yearsOfExperience: data.yearsOfExperience,
                        purpose: data.purpose,
                    },
                },
                {
                    salarySlipDoc: data.salarySlip,
                },
            );

            toast.success("Personal loan application submitted successfully!");
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
                <CommonLoanFields<PersonalLoanFormValues>
                    register={register}
                    control={control}
                    errors={errors}
                    fullName={name}
                    email={email}
                    limits={limits}
                />
            </FormSection>

            {/* ── Section 2: Employment Details ── */}
            <FormSection
                title="Employment Details"
                description="Tell us about your current employment to help assess your loan eligibility."
            >
                {/* Employer Name */}
                <InputField<PersonalLoanFormValues>
                    name="employerName"
                    label="Employer / Company Name"
                    register={register}
                    errors={errors}
                    placeholder="e.g. Infosys Ltd."
                    rules={{}}
                />

                {/* Years of Experience */}
                <InputField<PersonalLoanFormValues>
                    name="yearsOfExperience"
                    label="Years of Experience"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="e.g. 3"
                    hint="Total years in your current or previous role"
                    rules={{}}
                />

                {/* Loan Purpose — full width */}
                <div className="md:col-span-2">
                    <TextAreaField<PersonalLoanFormValues>
                        name="purpose"
                        label="Loan Purpose"
                        register={register}
                        errors={errors}
                        placeholder="Describe why you need this personal loan (e.g. medical emergency, home renovation, education fees…)"
                        rows={4}
                        rules={{}}
                    />
                </div>

                {/* Salary Slip Upload — full width */}
                <div className="md:col-span-2">
                    <FileUploadField<PersonalLoanFormValues>
                        name="salarySlip"
                        label="Salary Slip (Last 3 Months)"
                        control={control}
                        errors={errors}
                        accept=".pdf,.jpg,.jpeg,.png"
                        hint="Upload a clear copy of your latest salary slip (PDF or image)"
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

export default PersonalLoanForm;
