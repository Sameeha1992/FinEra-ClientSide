import z from "zod";

const isAtLeast18YearsOld = (dateString: string) => {
  const dob = new Date(dateString);

  if (isNaN(dob.getTime())) return false;

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 18;
};

export const verificationSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),

  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: "Invalid date of birth",
    })
    .refine((value) => isAtLeast18YearsOld(value), {
      message: "User must be at least 18 years old",
    }),
  gender: z.string().min(1, "Gender is required"),

  occupation: z.string().min(2, "Occupation is required"),

  annualIncome: z.string().min(1, "Annual income is required"),

  adhaarNumber: z.string().length(12, "Aadhaar number must be 12 digits"),

  panNumber: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),

  cibilScore: z.string().regex(/^[0-9]{3}$/, "CIBIL score must be 3 digits"),

  panDocument: z.instanceof(File, { message: "PAN document is required" }),

  aadharDocument: z.instanceof(File, {
    message: "Aadhaar document is required",
  }),
});
