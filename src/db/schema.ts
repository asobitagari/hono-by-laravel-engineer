import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const authors = sqliteTable('authors', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text(),
})

export const books = sqliteTable('books', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  authorId: int().notNull().references(() => authors.id),
  price: int().notNull(),
})

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  isAdmin: int({ mode: 'boolean' }).notNull().default(false),
})

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text().notNull().unique(),
  expiresAt: int({ mode: 'timestamp' }).notNull(),
  createdAt: int({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})
