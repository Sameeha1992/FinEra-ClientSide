import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(25, 'Name too long'),
  email: z.string().email('Invalid email address'),
  registerNumber: z
    .string()
    .min(5, 'Register number too short')
    .regex(/^[A-Z0-9-]+$/, 'Only letters, numbers and hyphens allowed'),  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;