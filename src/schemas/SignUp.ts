"use client"
 
import { z } from "zod"
 
export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})