import { z } from "zod";

const requiredFile = z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file.size > 0, { message: "Uploaded file cannot be empty" });

export const personalLoanSchema = z.object({
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
        .max(360, "Maximum loan tenure is 360 months (30 years)"),

    purpose: z.string().min(1, "Loan purpose is required").min(5, "Loan purpose must be at least 5 characters"),
    employerName: z.string().min(1, "Employer / company name is required"),

    yearsOfExperience: z
        .number({ message: "Years of experience is required" })
        .min(0, "Experience cannot be negative")
        .max(50, "Please enter a valid number of years"),

    salarySlip: requiredFile,
});

export type PersonalLoanFormValues = z.infer<typeof personalLoanSchema>;
