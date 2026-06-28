import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { authors } from '../../db/schema.js'
import type { Author, AuthorRepository, CreateAuthorInput, UpdateAuthorInput } from '../../domain/authors/AuthorRepository.js'

export class DrizzleAuthorRepository implements AuthorRepository {
  async findAll(): Promise<Author[]> {
    return db.select().from(authors)
  }

  async findById(id: number): Promise<Author> {
    const result = await db.select().from(authors).where(eq(authors.id, id))
    if (result.length === 0) throw new Error('Author not found')
    return result[0]
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const result = await db.insert(authors).values({ name: input.name, email: input.email ?? null }).returning()
    return result[0]
  }

  async update(id: number, input: UpdateAuthorInput): Promise<Author> {
    const result = await db.update(authors).set({ name: input.name, email: input.email ?? null }).where(eq(authors.id, id)).returning()
    if (result.length === 0) throw new Error('Author not found')
    return result[0]
  }

  async delete(id: number): Promise<void> {
    const result = await db.delete(authors).where(eq(authors.id, id)).returning()
    if (result.length === 0) throw new Error('Author not found')
  }
}
