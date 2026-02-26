import type { Control, FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import InputField from "./InputField";
import SelectField from "./SelectField";
import type { SelectOption } from "./SelectField";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMPLOYMENT_OPTIONS: SelectOption[] = [
    { label: "Salaried (Private Sector)", value: "salaried_private" },
    { label: "Salaried (Government)", value: "salaried_govt" },
    { label: "Self-Employed (Professional)", value: "self_employed_professional" },
    { label: "Self-Employed (Business)", value: "self_employed_business" },
    { label: "Freelancer / Contractor", value: "freelancer" },
    { label: "Retired", value: "retired" },
    { label: "Unemployed", value: "unemployed" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(0)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
};

// ---------------------------------------------------------------------------
// Props Interface
// ---------------------------------------------------------------------------

export interface CommonLoanFieldValues {
    phoneNumber: string;
    employmentType: string;
    monthlyIncome: number;
    loanAmount: number;
    loanTenure: number;
}

/** Loan product limits passed from the listing page via URL params */
export interface LoanLimits {
    minAmount?: number;
    maxAmount?: number;
    minTenure?: number;
    maxTenure?: number;
    minSalary?: number;
}

interface CommonLoanFieldsProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    control: Control<T>;
    errors: FieldErrors<T>;
    /** Pre-filled read-only value from Redux auth store */
    fullName?: string | null;
    /** Pre-filled read-only value from Redux auth store */
    email?: string | null;
    /** Loan product limits from the selected listing row */
    limits?: LoanLimits;
}

const CommonLoanFields = <T extends FieldValues>({
    register,
    errors,
    fullName,
    email,
    limits = {},
}: CommonLoanFieldsProps<T>) => {
    const { minAmount, maxAmount, minTenure, maxTenure, minSalary } = limits;

    // Build dynamic hint strings showing the allowed range
    const amountHint =
        minAmount !== undefined && maxAmount !== undefined
            ? `Allowed range: ${fmt(minAmount)} – ${fmt(maxAmount)}`
            : undefined;

    const tenureHint =
        minTenure !== undefined && maxTenure !== undefined
            ? `Allowed range: ${minTenure} – ${maxTenure} months`
            : undefined;

    const salaryHint =
        minSalary !== undefined && minSalary > 0
            ? `Minimum required salary: ${fmt(minSalary)} per month`
            : undefined;

    return (
        <>
            {/* Full Name — read-only, pre-filled from auth */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Full Name
                    <span className="ml-1.5 text-xs font-normal text-slate-400">(from your account)</span>
                </label>
                <input
                    type="text"
                    value={fullName ?? ""}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-500 bg-slate-50 cursor-not-allowed border-slate-200"
                />
            </div>

            {/* Email — read-only, pre-filled from auth */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Email Address
                    <span className="ml-1.5 text-xs font-normal text-slate-400">(from your account)</span>
                </label>
                <input
                    type="email"
                    value={email ?? ""}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-500 bg-slate-50 cursor-not-allowed border-slate-200"
                />
            </div>

            {/* Phone Number */}
            <InputField<T>
                name={"phoneNumber" as Path<T>}
                label="Phone Number"
                type="tel"
                register={register}
                errors={errors}
                placeholder="e.g. 9876543210"
                rules={{
                    required: "Phone number is required",
                    pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit Indian mobile number",
                    },
                }}
            />

            {/* Employment Type */}
            <SelectField<T>
                name={"employmentType" as Path<T>}
                label="Employment Type"
                options={EMPLOYMENT_OPTIONS}
                register={register}
                errors={errors}
                placeholder="Select employment type"
                rules={{ required: "Employment type is required" }}
            />

            {/* Monthly Income */}
            <InputField<T>
                name={"monthlyIncome" as Path<T>}
                label="Monthly Income (₹)"
                type="number"
                register={register}
                errors={errors}
                placeholder="e.g. 50000"
                hint={salaryHint ?? "Your net take-home income per month"}
                rules={{
                    required: "Monthly income is required",
                    min: {
                        value: minSalary && minSalary > 0 ? minSalary : 1,
                        message:
                            minSalary && minSalary > 0
                                ? `Minimum salary required for this loan is ${fmt(minSalary)}`
                                : "Income must be greater than 0",
                    },
                }}
            />

            {/* Loan Amount */}
            <InputField<T>
                name={"loanAmount" as Path<T>}
                label="Loan Amount (₹)"
                type="number"
                register={register}
                errors={errors}
                placeholder={
                    minAmount && maxAmount
                        ? `${fmt(minAmount)} – ${fmt(maxAmount)}`
                        : "e.g. 500000"
                }
                hint={amountHint}
                rules={{
                    required: "Loan amount is required",
                    min: {
                        value: minAmount ?? 1000,
                        message: `Minimum loan amount is ${fmt(minAmount ?? 1000)}`,
                    },
                    max: maxAmount
                        ? {
                            value: maxAmount,
                            message: `Maximum loan amount is ${fmt(maxAmount)}`,
                        }
                        : undefined,
                }}
            />

            {/* Loan Tenure */}
            <InputField<T>
                name={"loanTenure" as Path<T>}
                label="Loan Tenure (Months)"
                type="number"
                register={register}
                errors={errors}
                placeholder={
                    minTenure && maxTenure
                        ? `${minTenure} – ${maxTenure} months`
                        : "e.g. 36"
                }
                hint={tenureHint ?? "Duration to repay the loan in months"}
                rules={{
                    required: "Loan tenure is required",
                    min: {
                        value: minTenure ?? 1,
                        message: `Minimum tenure is ${minTenure ?? 1} months`,
                    },
                    max: maxTenure
                        ? {
                            value: maxTenure,
                            message: `Maximum tenure is ${maxTenure} months`,
                        }
                        : { value: 360, message: "Maximum tenure is 360 months" },
                }}
            />
        </>
    );
};

export default CommonLoanFields;
