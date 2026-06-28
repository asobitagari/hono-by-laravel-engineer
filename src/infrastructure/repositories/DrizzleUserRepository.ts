import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { users } from '../../db/schema.js'
import type { User, UserWithPassword, UserRepository, CreateUserInput, UpdateUserInput } from '../../domain/users/UserRepository.js'
import { hashPassword } from '../../shared/password.js'

export class DrizzleUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
    }).from(users)
  }

  async findById(id: number): Promise<User> {
    const result = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
    }).from(users).where(eq(users.id, id))
    if (result.length === 0) throw new Error('User not found')
    return result[0]
  }

  async findByEmail(email: string): Promise<UserWithPassword> {
    const result = await db.select().from(users).where(eq(users.email, email))
    if (result.length === 0) throw new Error('User not found')
    return result[0]
  }

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await hashPassword(input.password)
    const result = await db.insert(users).values({ ...input, password: hashedPassword }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
    })
    return result[0]
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const result = await db.update(users).set(input).where(eq(users.id, id)).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
    })
    if (result.length === 0) throw new Error('User not found')
    return result[0]
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    const result = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id)).returning()
    if (result.length === 0) throw new Error('User not found')
  }

  async delete(id: number): Promise<void> {
    const result = await db.delete(users).where(eq(users.id, id)).returning()
    if (result.length === 0) throw new Error('User not found')
  }
}
