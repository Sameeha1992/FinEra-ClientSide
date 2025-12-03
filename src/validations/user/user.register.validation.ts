import z from "zod";

export const registerUserSchema = z
  .object({
    fullName:z.string().max(20,"Should not exceed above 20 letters")
    .min(3,"Name too short")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(25, "Email too long"),

      phone:z.string().max(10,"Should not exceed above 10 numbers").regex(/[1-9]/,"please enter only numbers"),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /[A-Z]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[a-z]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[0-9]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[\W_]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      ),
    confirmPassword: z.string().min(8, "Password must be atleast 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type FormData = z.infer<typeof registerUserSchema >
