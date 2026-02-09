import z from "zod";


export const verificationSchema = z.object({
    phoneNumber:z.string().min(10,"Phone number must be 10 digits")
    .max(10,"Phone number must be 10 digits"),

    dateOfBirth:z.string().nonempty("Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),

    occupation:z.string()
    .min(2,"Occupation is required"),

   annualIncome: z
    .string()
    .min(1, "Annual income is required"),

  adhaarNumber: z
    .string()
    .length(12, "Aadhaar number must be 12 digits"),

  panNumber: z
    .string()
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),

  cibilScore: z
    .string()
    .regex(/^[0-9]{3}$/, "CIBIL score must be 3 digits"),

  panDocument: z
    .instanceof(File, { message: "PAN document is required" }),

  aadharDocument: z
    .instanceof(File, { message: "Aadhaar document is required" }),
});
