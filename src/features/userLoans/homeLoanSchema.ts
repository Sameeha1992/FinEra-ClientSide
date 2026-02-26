import { z } from "zod";

const requiredFile = z
    .instanceof(File, { message: "Please upload a document" })
    .refine((file) => file.size > 0, { message: "Uploaded file cannot be empty" });

export const homeLoanSchema = z.object({
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
        .min(12, "Minimum loan tenure is 12 months")
        .max(360, "Maximum loan tenure is 360 months (30 years)"),

    propertyValue: z
        .number({ message: "Property value is required" })
        .positive("Property value must be greater than zero"),

    propertyLocation: z.string().min(1, "Property location is required"),
    propertyType: z.string().min(1, "Please select the property type"),

    propertyDocument: requiredFile,
});

export type HomeLoanFormValues = z.infer<typeof homeLoanSchema>;
