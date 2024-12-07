import { sign } from 'crypto';
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),

  email: z
    .string()
    .email({ message: 'Insira um email válido' })
    .min(2, { message: 'O email deve ter no mínimo 2 caracteres' })
    .max(50, { message: 'O email deve ter no máximo 50 caracteres' }),

  password: z
    .string()
    .min(2, { message: 'A senha deve ter no mínimo 2 caracteres' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres' }),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});