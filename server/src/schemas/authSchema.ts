import { z } from 'zod';

export const RegisterUserInputsSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPass: z.string()
}).refine(data => data.password === data.confirmPass, {
  message: 'Passwords do not match',
  path: ["confirmPass"]
});

export const LoginSchema = z.object({
  email: z.email({ message: 'Invalid credentials' }),
  password: z.string().min(8, { message: 'Invalid credentials' })
});

export type LoginUserInput = z.infer<typeof LoginSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserInputsSchema>;