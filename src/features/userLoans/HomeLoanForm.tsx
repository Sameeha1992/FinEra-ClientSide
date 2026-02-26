import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { RootState } from "@/redux/store";

import { homeLoanSchema } from "./homeLoanSchema";
import type { HomeLoanFormValues } from "./homeLoanSchema";

import CommonLoanFields from "@/components/loanForms/CommonLoanFields";
import InputField from "@/components/loanForms/InputField";
import SelectField from "@/components/loanForms/SelectField";
import FileUploadField from "@/components/loanForms/FileUploadField";
import FormSection from "@/components/loanForms/FormSection";
import SubmitButton from "@/components/loanForms/SubmitButton";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROPERTY_TYPE_OPTIONS = [
    { label: "Flat / Apartment", value: "flat" },
    { label: "Independent House", value: "independent_house" },
    { label: "Plot / Land", value: "plot" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HomeLoanForm = () => {
    const { name, email } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();

    const limits = {
        minAmount: Number(searchParams.get("minAmount")) || undefined,
        maxAmount: Number(searchParams.get("maxAmount")) || undefined,
        minTenure: Number(searchParams.get("minTenure")) || undefined,
        maxTenure: Number(searchParams.get("maxTenure")) || undefined,
        minSalary: Number(searchParams.get("minSalary")) || undefined,
    };

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<HomeLoanFormValues>({
        resolver: zodResolver(homeLoanSchema),
    });

    // ── Submit Handler ─────────────────────────────────────────────────────────
    const onSubmit = (data: HomeLoanFormValues) => {
        console.log("✅ Home Loan Form — Validated Data:", data);
        // TODO: Dispatch to API or state when backend is ready
    };

    // ── Render ─────────────────────────────────────────────────────────────────
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
                {/* Fields render directly into FormSection's md:grid-cols-2 grid */}
                <CommonLoanFields<HomeLoanFormValues>
                    register={register}
                    control={control}
                    errors={errors}
                    fullName={name}
                    email={email}
                    limits={limits}
                />
            </FormSection>

            {/* ── Section 2: Property Details ── */}
            <FormSection
                title="Property Details"
                description="Tell us about the property you wish to purchase or construct."
            >
                {/* Property Value */}
                <InputField<HomeLoanFormValues>
                    name="propertyValue"
                    label="Property Value (₹)"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="e.g. 5000000"
                    hint="Total market value of the property"
                    rules={{}}
                />

                {/* Property Type */}
                <SelectField<HomeLoanFormValues>
                    name="propertyType"
                    label="Property Type"
                    options={PROPERTY_TYPE_OPTIONS}
                    register={register}
                    errors={errors}
                    placeholder="Select property type"
                    rules={{ required: "Please select the property type" }}
                />

                {/* Property Location — full width */}
                <div className="md:col-span-2">
                    <InputField<HomeLoanFormValues>
                        name="propertyLocation"
                        label="Property Location"
                        register={register}
                        errors={errors}
                        placeholder="e.g. Koramangala, Bengaluru, Karnataka"
                        hint="City, area, and state where the property is located"
                        rules={{}}
                    />
                </div>

                {/* Property Document — full width */}
                <div className="md:col-span-2">
                    <FileUploadField<HomeLoanFormValues>
                        name="propertyDocument"
                        label="Property Document"
                        control={control}
                        errors={errors}
                        accept=".pdf,.jpg,.jpeg,.png"
                        hint="Upload sale deed, agreement, or any official property document (PDF or image)"
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

export default HomeLoanForm;
