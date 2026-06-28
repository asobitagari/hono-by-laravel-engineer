import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { DrizzleAuthorRepository } from '../infrastructure/repositories/DrizzleAuthorRepository.js'
import { getAuthorsUseCase } from '../useCases/authors/getAuthorsUseCase.js'
import { getAuthorUseCase } from '../useCases/authors/getAuthorUseCase.js'
import { createAuthorUseCase } from '../useCases/authors/createAuthorUseCase.js'
import { updateAuthorUseCase } from '../useCases/authors/updateAuthorUseCase.js'
import { deleteAuthorUseCase } from '../useCases/authors/deleteAuthorUseCase.js'
import { createAuthorSchema, updateAuthorSchema } from '../validators/authors.js'

const repo = new DrizzleAuthorRepository()
const app = new Hono()

app.get('/', async (c) => {
  const authors = await getAuthorsUseCase(repo)
  return c.json(authors)
})

app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const author = await getAuthorUseCase(repo, id)
  return c.json(author)
})

app.post('/', authMiddleware, adminMiddleware, zValidator('json', createAuthorSchema), async (c) => {
  const { name, email } = c.req.valid('json')
  const author = await createAuthorUseCase(repo, name, email)
  return c.json(author, 201)
})

app.put('/:id', authMiddleware, adminMiddleware, zValidator('json', updateAuthorSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const { name, email } = c.req.valid('json')
  const author = await updateAuthorUseCase(repo, id, name, email)
  return c.json(author)
})

app.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'))
  const result = await deleteAuthorUseCase(repo, id)
  return c.json(result)
})

export { app as authorsRoute }
