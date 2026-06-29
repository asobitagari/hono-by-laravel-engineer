import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { type UserRepository } from '../domain/users/UserRepository.js'
import { getUsersUseCase } from '../useCases/users/getUsersUseCase.js'
import { getUserUseCase } from '../useCases/users/getUserUseCase.js'
import { updateUserUseCase } from '../useCases/users/updateUserUseCase.js'
import { deleteUserUseCase } from '../useCases/users/deleteUserUseCase.js'
import { updateUserSchema } from '../validators/users.js'

export function createUsersRoute(repo: UserRepository) {
const app = new Hono()

app.get('/', async (c) => {
  const users = await getUsersUseCase(repo)
  return c.json(users)
})

app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const user = await getUserUseCase(repo, id)
  return c.json(user)
})

app.put('/:id', authMiddleware, adminMiddleware, zValidator('json', updateUserSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const { name, email, isAdmin } = c.req.valid('json')
  const user = await updateUserUseCase(repo, id, name, email, isAdmin)
  return c.json(user)
})

app.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'))
  const result = await deleteUserUseCase(repo, id)
  return c.json(result)
})

  return app
}
