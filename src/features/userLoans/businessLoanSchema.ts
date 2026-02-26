import { z } from "zod";

const requiredFile = z
    .instanceof(File, { message: "Please upload a document" })
    .refine((file) => file.size > 0, { message: "Uploaded file cannot be empty" });

export const businessLoanSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

    employmentType: z.string().min(1, "Please select your employment type"),

    monthlyIncome: z
        .number({ message: "Monthly income is required" })
        .positive("Monthly income must be greater than zero"),

    loanAmount: z
        .number({ message: "Loan amount is required" })
        .positive("Loan amount must be greater than zero"),

    loanTenure: z
        .number({ message: "Loan tenure is required" })
        .min(6, "Minimum loan tenure is 6 months")
        .max(120, "Maximum loan tenure is 120 months (10 years)"),

    businessName: z.string().min(1, "Business name is required"),
    businessType: z.string().min(1, "Please select your business type"),

    annualRevenue: z
        .number({ message: "Annual revenue is required" })
        .positive("Annual revenue must be greater than zero"),

    businessRegistrationDoc: requiredFile,
});

export type BusinessLoanFormValues = z.infer<typeof businessLoanSchema>;
