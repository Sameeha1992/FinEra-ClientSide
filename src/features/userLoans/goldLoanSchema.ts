import { z } from "zod";

const requiredImageFile = z
    .instanceof(File, { message: "Please upload an image of your gold" })
    .refine((file) => file.size > 0, { message: "Uploaded file cannot be empty" })
    .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
        { message: "Only JPG, PNG, or WebP images are accepted" }
    );

export const goldLoanSchema = z.object({
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
        .min(3, "Minimum loan tenure is 3 months")
        .max(84, "Maximum loan tenure is 84 months (7 years)"),

    goldWeight: z
        .number({ message: "Gold weight is required" })
        .positive("Gold weight must be greater than zero"),

    goldImage: requiredImageFile,
});

export type GoldLoanFormValues = z.infer<typeof goldLoanSchema>;
