import { createMiddleware } from 'hono/factory'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import type { AuthVariables } from './authMiddleware.js'

export const adminMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const userId = c.get('userId')
  const result = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, userId))
  if (result.length === 0 || !result[0].isAdmin) {
    return c.json({ message: 'Forbidden' }, 403)
  }
  await next()
})
