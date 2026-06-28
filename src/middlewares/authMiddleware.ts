import { createMiddleware } from 'hono/factory'
import { eq } from 'drizzle-orm'
import { verifyAccessToken } from '../shared/token.js'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'

export type AuthVariables = {
  userId: number
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const token = authHeader.slice(7)
  try {
    const userId = await verifyAccessToken(token)
    const result = await db.select({ id: users.id }).from(users).where(eq(users.id, userId))
    if (result.length === 0) return c.json({ message: 'Unauthorized' }, 401)
    c.set('userId', userId)
    await next()
  } catch {
    return c.json({ message: 'Unauthorized' }, 401)
  }
})
