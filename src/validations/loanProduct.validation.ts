import { z } from "zod";

// Zod schema for loan product
export const loanProductSchema = z.object({
  name: z.string().min(1, { message: "Loan name is required" }),
  loanType: z.string().min(1, { message: "Loan type is required" }),
  description: z.string().min(1, { message: "Loan description is required" }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  amount: z
    .object({
      minimum: z.coerce.number().min(1, "Minimum amount is required"),
      maximum: z.coerce.number().min(1, "Maximum amount is required"),
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
      minimum: z.coerce.number().min(1, "Minimum amount is required"),
      maximum: z.coerce.number().min(1, "Maximum amount is required"),
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

  interestRate: z.coerce.number().min(1, { message: "Interest rate is required" }),
  eligibility: z.object({
    minAge: z.coerce.number().min(18, { message: "Minimum age should be at least 18" }),
    maxAge: z.coerce.number().min(70, { message: "Maximum age is required" }),
    minSalary: z.coerce.number({ error: "Minimum salary is required" }).min(5000, { message: "Minimum salary must be at least ₹5,000" }),
    minCibilScore: z.coerce.number().min(300, { message: "CIBIL score must be at least 300" }),
  }),
});
