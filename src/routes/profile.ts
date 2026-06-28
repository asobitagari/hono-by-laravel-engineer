import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthVariables } from '../middlewares/authMiddleware.js'
import { DrizzleUserRepository } from '../infrastructure/repositories/DrizzleUserRepository.js'
import { updateProfileNameService } from '../services/profile/updateProfileNameService.js'
import { updatePasswordService } from '../services/profile/updatePasswordService.js'
import { updateProfileSchema, updatePasswordSchema } from '../validators/profile.js'

const repo = new DrizzleUserRepository()
const app = new Hono<{ Variables: AuthVariables }>()

app.use('*', authMiddleware)

app.get('/', async (c) => {
  const userId = c.get('userId')
  const profile = await repo.findById(userId)
  return c.json(profile)
})

app.put('/', zValidator('json', updateProfileSchema), async (c) => {
  const userId = c.get('userId')
  const { name } = c.req.valid('json')
  const profile = await updateProfileNameService(repo, userId, name)
  return c.json(profile)
})

app.put('/password', zValidator('json', updatePasswordSchema), async (c) => {
  const userId = c.get('userId')
  const { currentPassword, newPassword } = c.req.valid('json')
  try {
    const result = await updatePasswordService(repo, userId, currentPassword, newPassword)
    return c.json(result)
  } catch {
    return c.json({ message: 'Invalid current password' }, 401)
  }
})

export { app as profileRoute }
