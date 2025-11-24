import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z                                                                   
     .string()
    .min(8, { message: "Password must be atleast 8 characters." }),
  role: z.enum(["admin", "vendor", "user"]),
});

export type LoginValue = z.infer<typeof loginSchema>;
