import z from 'zod';

export const userValidate = z.object({
  userName: z.string().max(50, 'UserName is too long').optional(),
  email: z.string().email().optional(),
  password: z.string().refine(value => /[^\w\s]/.test(value), {
    message: 'Password must contain at least one special character',
  }).optional(),
  image: z.string().optional(),
});

export const emailValidate = z.object({
  email: z.string().email()
});