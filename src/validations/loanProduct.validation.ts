import { z } from "zod";

// Zod schema for loan product
export const loanProductSchema = z.object({
  name: z.string().min(1, { message: "Loan name is required" }),
  loanType: z.string().min(1, { message: "Loan type is required" }),
  description: z.string().min(1, { message: "Loan description is required" }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  processingFee: z.number().min(1, "Processing fee is required").max(2, "Processing fee should not go above 2"),
  amount: z
    .object({
      minimum: z.number().min(1, "Minimum amount is required"),
      maximum: z.number().min(1, "Maximum amount is required"),
    })
    .superRefine((data, ctx) => {
      if (data.maximum < data.minimum) {
        ctx.addIssue({
          code: "custom",
          message: "Maximum amount must be greater than minimum amount",
          path: ["maximum"], // show error on maximum field
        });
      }
    }),

  tenure: z
    .object({
      minimum: z.number().min(1, "Minimum amount is required"),
      maximum: z.number().min(1, "Maximum amount is required"),
    })
    .superRefine((data, ctx) => {
      if (data.maximum < data.minimum) {
        ctx.addIssue({
          code: "custom",
          message: "Maximum amount must be greater than minimum amount",
          path: ["maximum"], // show error on maximum field
        });
      }
    }),

  interestRate: z.number().min(1, { message: "Interest rate is required" }),
  duePenalty: z.number().min(0, { message: "Due penalty is required" }),
  eligibility: z.object({
    minAge: z.number().min(18, { message: "Minimum age should be at least 18" }),
    maxAge: z.number().min(70, { message: "Maximum age is required" }),
    minSalary: z.number({ error: "Minimum salary is required" }).min(5000, { message: "Minimum salary must be at least ₹5,000" }),
    minCibilScore: z.number().min(300, { message: "CIBIL score must be at least 300" }),
  }),
});
