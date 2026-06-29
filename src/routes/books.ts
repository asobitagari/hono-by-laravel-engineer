import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { type BookRepository } from '../domain/books/BookRepository.js'
import { getBooksUseCase } from '../useCases/books/getBooksUseCase.js'
import { getBookUseCase } from '../useCases/books/getBookUseCase.js'
import { createBookUseCase } from '../useCases/books/createBookUseCase.js'
import { updateBookUseCase } from '../useCases/books/updateBookUseCase.js'
import { deleteBookUseCase } from '../useCases/books/deleteBookUseCase.js'
import { createBookSchema, updateBookSchema } from '../validators/books.js'

export function createBooksRoute(repo: BookRepository) {
const app = new Hono()

app.get('/', async (c) => {
  const books = await getBooksUseCase(repo)
  return c.json(books)
})

app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const book = await getBookUseCase(repo, id)
  return c.json(book)
})

app.post('/', authMiddleware, adminMiddleware, zValidator('json', createBookSchema), async (c) => {
  const { title, authorId, price } = c.req.valid('json')
  const book = await createBookUseCase(repo, title, authorId, price)
  return c.json(book, 201)
})

app.put('/:id', authMiddleware, adminMiddleware, zValidator('json', updateBookSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const { title, authorId, price } = c.req.valid('json')
  const book = await updateBookUseCase(repo, id, title, authorId, price)
  return c.json(book)
})

app.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'))
  const result = await deleteBookUseCase(repo, id)
  return c.json(result)
})

  return app
}
