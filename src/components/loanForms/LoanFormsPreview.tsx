import { useForm } from "react-hook-form";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import FileUploadField from "./FileUploadField";
import DatePickerField from "./DatePickerField";
import ErrorMessage from "./ErrorMessage";
import SubmitButton from "./SubmitButton";
import FormSection from "./FormSection";
import CommonLoanFields from "./CommonLoanFields";
import type { CommonLoanFieldValues } from "./CommonLoanFields";
import toast from "react-hot-toast";

interface PreviewForm extends CommonLoanFieldValues {
    loanPurpose: string;
    dateOfBirth: string;
    favoriteColor: string;
    salarySlip: File | null;
}

const COLOUR_OPTIONS = [
    { label: "Teal", value: "teal" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Red", value: "red" },
];

export default function LoanFormsPreview() {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PreviewForm>({
        defaultValues: {},
    });

    const onSubmit = (data: PreviewForm) => {
        console.log("Form submitted:", data);
        toast.success("✅ Form submitted! Check console for values.");
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            {/* Page Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    🧩 LoanForms — Component Preview
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    All reusable form components rendered together for visual review.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-4xl mx-auto flex flex-col gap-6"
            >
                {/* ── 1. ErrorMessage ── */}
                <FormSection
                    title="1 · ErrorMessage"
                    description="Shown below any field when validation fails."
                >
                    <div className="md:col-span-2 space-y-2">
                        <p className="text-xs text-slate-400 font-mono">Static demo — not wired to a field</p>
                        <ErrorMessage message="This field is required." />
                        <ErrorMessage message="Enter a valid 10-digit mobile number." />
                        <ErrorMessage message={undefined} />
                        <p className="text-xs text-teal-600">↑ No message = nothing renders</p>
                    </div>
                </FormSection>

                {/* ── 2. InputField ── */}
                <FormSection
                    title="2 · InputField"
                    description="Supports text, number, email, password, tel — with readOnly and validation."
                >
                    {/* NOTE: fullName & email (readOnly) will be demoed here once backend auth is integrated */}
                    <InputField<PreviewForm>
                        name="monthlyIncome"
                        label="Monthly Income (₹)"
                        type="number"
                        placeholder="e.g. 50000"
                        register={register}
                        errors={errors}
                        hint="Net take-home per month"
                        rules={{ required: "Income is required", min: { value: 1, message: "Must be > 0" } }}
                    />
                    <InputField<PreviewForm>
                        name="loanAmount"
                        label="Loan Amount (₹)"
                        type="number"
                        placeholder="e.g. 500000"
                        register={register}
                        errors={errors}
                        rules={{ required: "Loan amount is required" }}
                    />
                </FormSection>

                {/* ── 3. SelectField ── */}
                <FormSection
                    title="3 · SelectField"
                    description="Dropdown with dynamic options, placeholder, and validation."
                >
                    <SelectField<PreviewForm>
                        name="employmentType"
                        label="Employment Type"
                        options={[
                            { label: "Salaried (Private)", value: "salaried_private" },
                            { label: "Self-Employed", value: "self_employed" },
                            { label: "Freelancer", value: "freelancer" },
                        ]}
                        register={register}
                        errors={errors}
                        placeholder="Select employment type"
                        rules={{ required: "Employment type is required" }}
                    />
                    <SelectField<PreviewForm>
                        name="favoriteColor"
                        label="Preferred Colour (optional)"
                        options={COLOUR_OPTIONS}
                        register={register}
                        errors={errors}
                        placeholder="Choose a colour"
                    />
                </FormSection>

                {/* ── 4. TextAreaField ── */}
                <FormSection
                    title="4 · TextAreaField"
                    description="Multi-line input for longer text like loan purpose or remarks."
                >
                    <div className="md:col-span-2">
                        <TextAreaField<PreviewForm>
                            name="loanPurpose"
                            label="Loan Purpose"
                            register={register}
                            errors={errors}
                            placeholder="Briefly describe why you need this loan…"
                            rows={4}
                            rules={{ required: "Loan purpose is required", minLength: { value: 20, message: "At least 20 characters" } }}
                        />
                    </div>
                </FormSection>

                {/* ── 5. DatePickerField ── */}
                <FormSection
                    title="5 · DatePickerField"
                    description="Native date picker via Controller with min/max date support."
                >
                    <DatePickerField<PreviewForm>
                        name="dateOfBirth"
                        label="Date of Birth"
                        control={control}
                        errors={errors}
                        max={new Date().toISOString().split("T")[0]}
                        rules={{ required: "Date of birth is required" }}
                    />
                </FormSection>

                {/* ── 6. FileUploadField ── */}
                <FormSection
                    title="6 · FileUploadField"
                    description="Single file upload with custom UI, file name display, and clear button."
                >
                    <div className="md:col-span-2">
                        <FileUploadField<PreviewForm>
                            name="salarySlip"
                            label="Salary Slip"
                            control={control}
                            errors={errors}
                            accept=".pdf,.jpg,.jpeg,.png"
                            hint="Upload your latest 3-month salary slip"
                            rules={{ required: "Salary slip is required" }}
                        />
                    </div>
                </FormSection>

                {/* ── 7. FormSection ── */}
                <FormSection
                    title="7 · FormSection"
                    description="You're looking at it! A titled card that groups related fields with consistent spacing."
                >
                    <div className="md:col-span-2 text-sm text-slate-500 bg-slate-50 rounded-lg p-4 border border-dashed border-slate-300">
                        <code className="font-mono text-teal-700 text-xs block">
                            {`<FormSection title="Section Title" description="Optional description">`}
                            <br />
                            &nbsp;&nbsp;{`{/* your fields go here */}`}
                            <br />
                            {`</FormSection>`}
                        </code>
                    </div>
                </FormSection>

                {/* ── 8. CommonLoanFields ── */}
                <FormSection
                    title="8 · CommonLoanFields"
                    description="Pre-built block of shared fields for all loan types (contact, employment, financial details)."
                >
                    <div className="md:col-span-2">
                        <CommonLoanFields<PreviewForm>
                            register={register}
                            control={control}
                            errors={errors}
                        />
                    </div>
                </FormSection>

                {/* ── 9. SubmitButton ── */}
                <FormSection
                    title="9 · SubmitButton"
                    description="Submit button with loading spinner and disabled state."
                >
                    <div className="md:col-span-2 flex flex-col gap-3">
                        <SubmitButton label="Submit Application" isLoading={false} />
                        <SubmitButton label="Loading State" loadingLabel="Submitting…" isLoading={true} />
                        <SubmitButton label="Disabled State" disabled={true} />
                        <div className="border-t border-slate-100 pt-3">
                            <p className="text-xs text-slate-400 mb-2">↓ Live submit (triggers validation on all fields above)</p>
                            <SubmitButton
                                label="Submit Form"
                                loadingLabel="Submitting…"
                                isLoading={isSubmitting}
                            />
                        </div>
                    </div>
                </FormSection>
            </form>
        </div>
    );
}
