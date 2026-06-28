import { z } from 'zod'

export const createBookSchema = z.object({
  title: z.string().min(1),
  authorId: z.number(),
  price: z.number().positive(),
})

export const updateBookSchema = z.object({
  title: z.string().min(1),
  authorId: z.number(),
  price: z.number().positive(),
})
