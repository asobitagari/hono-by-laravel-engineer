import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { books } from '../../db/schema.js'
import type { Book, BookRepository, CreateBookInput, UpdateBookInput } from '../../domain/books/BookRepository.js'

export class DrizzleBookRepository implements BookRepository {
  async findAll(): Promise<Book[]> {
    return db.select().from(books)
  }

  async findById(id: number): Promise<Book> {
    const result = await db.select().from(books).where(eq(books.id, id))
    if (result.length === 0) throw new Error('Book not found')
    return result[0]
  }

  async create(input: CreateBookInput): Promise<Book> {
    const result = await db.insert(books).values(input).returning()
    return result[0]
  }

  async update(id: number, input: UpdateBookInput): Promise<Book> {
    const result = await db.update(books).set(input).where(eq(books.id, id)).returning()
    if (result.length === 0) throw new Error('Book not found')
    return result[0]
  }

  async delete(id: number): Promise<void> {
    const result = await db.delete(books).where(eq(books.id, id)).returning()
    if (result.length === 0) throw new Error('Book not found')
  }
}
