import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import type { RootState } from "@/redux/store";
import { homeLoanSchema } from "./homeLoanSchema";
import type { HomeLoanFormValues } from "./homeLoanSchema";
import { LoanApplication } from "@/api/loanApplication/loan.application";
import { UserApplicationservice } from "@/api/user/user.loan.application";
import axios from "axios";

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
    // ── Auth & Route params ──────────────────────────────────────────────────
    const { name, email, Id: userId } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const loanProductId = searchParams.get("loanId") ?? "";
    const vendorId = searchParams.get("vendorId") ?? "";
    const loanType = (searchParams.get("loanType") ?? "HOME") as "HOME";
    const applicationId = searchParams.get("applicationId") ?? "";
    const isReapply = !!applicationId;

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
        reset,
        formState: { errors, isSubmitting },
    } = useForm<HomeLoanFormValues>({
        resolver: zodResolver(homeLoanSchema),
    });

    // ── Pre-fill form for reapply (using react-query) ────────────────────────
    const { data: appDetail, isLoading: loadingDetail } = useQuery({
        queryKey: ["applicationDetail", applicationId],
        queryFn: () => UserApplicationservice.getApplicationDetail(applicationId),
        enabled: isReapply,
    });

    useEffect(() => {
        if (!appDetail) return;
        reset({
            phoneNumber: appDetail.phoneNumber,
            employmentType: appDetail.employmentType as any,
            monthlyIncome: appDetail.monthlyIncome,
            loanAmount: appDetail.loanAmount,
            loanTenure: appDetail.loanTenure,
            propertyValue: appDetail.homeDetails?.propertyValue,
            propertyLocation: appDetail.homeDetails?.propertyLocation,
            propertyType: appDetail.homeDetails?.propertyType as any,
        });
    }, [appDetail, reset]);

    // ── Submit Handler ───────────────────────────────────────────────────────
    const onSubmit = async (data: HomeLoanFormValues) => {
        if (!userId) {
            toast.error("User session expired. Please log in again.");
            return;
        }

        try {
            const payload = {
                userId,
                vendorId,
                loanProductId,
                loanType,
                phoneNumber: data.phoneNumber,
                employmentType: data.employmentType,
                monthlyIncome: data.monthlyIncome,
                loanAmount: data.loanAmount,
                loanTenure: data.loanTenure,
                homeDetails: {
                    propertyValue: data.propertyValue,
                    propertyLocation: data.propertyLocation,
                    propertyType: data.propertyType,
                },
            };
            const files = {
                propertyDoc: data.propertyDocument,
            };

            if (isReapply) {
                await LoanApplication.reapplyRejectedLoan(applicationId, payload, files);
                toast.success("Home loan application re-submitted successfully!");
            } else {
                await LoanApplication.createLoanApplication(payload, files);
                toast.success("Home loan application submitted successfully!");
            }
            navigate("/user/loans");
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Failed to submit application. Please try again."
                : "Failed to submit application. Please try again.";
            toast.error(message);
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────
    if (loadingDetail) {
        return (
            <div className="py-16 text-center">
                <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading application data…</p>
            </div>
        );
    }

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
                        existingFileUrl={appDetail?.homeDetails?.propertyDocUrl}
                    />
                </div>
            </FormSection>

            {/* ── Submit ── */}
            <SubmitButton
                label={isReapply ? "Re-apply" : "Submit Application"}
                loadingLabel={isReapply ? "Re-submitting…" : "Submitting…"}
                isLoading={isSubmitting}
            />
        </form>
    );
};

export default HomeLoanForm;
