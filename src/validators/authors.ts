import { z } from 'zod'

export const createAuthorSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().optional(),
})

export const updateAuthorSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().optional(),
})
