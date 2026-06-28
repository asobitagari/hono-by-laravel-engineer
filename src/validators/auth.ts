import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const logoutSchema = z.object({
  token: z.string().min(1),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})
