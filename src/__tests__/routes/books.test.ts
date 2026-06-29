import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { createBooksRoute } from '../../routes/books.js'
import { DrizzleBookRepository } from '../../infrastructure/repositories/DrizzleBookRepository.js'
import { db } from '../../db/index.js'
import { authors, books, users } from '../../db/schema.js'
import { hashPassword } from '../../shared/password.js'
import { generateAccessToken } from '../../shared/token.js'

const app = new Hono()
app.route('/api/books', createBooksRoute(new DrizzleBookRepository()))

let adminToken: string
let normalToken: string
let authorId: number

beforeEach(async () => {
  const [admin] = await db.insert(users).values({
    name: 'Admin', email: 'admin@test.com',
    password: await hashPassword('pass'), isAdmin: true,
  }).returning()
  adminToken = await generateAccessToken(admin.id)

  const [normal] = await db.insert(users).values({
    name: 'Normal', email: 'normal@test.com',
    password: await hashPassword('pass'), isAdmin: false,
  }).returning()
  normalToken = await generateAccessToken(normal.id)

  const [author] = await db.insert(authors).values({ name: 'Author 1', email: 'author1@example.com' }).returning()
  authorId = author.id
  await db.insert(books).values({ title: 'Book 1', authorId, price: 1500 })
})

afterEach(async () => {
  await db.delete(books)
  await db.delete(authors)
  await db.delete(users)
})

describe('GET /api/books', () => {
  test('一覧取得', async () => {
    const res = await app.request('/api/books')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(1)
    expect(body[0]).toHaveProperty('title')
    expect(body[0]).toHaveProperty('price')
  })
})

describe('GET /api/books/:id', () => {
  test('個別取得', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(book.id)
    expect(body.title).toBe('Book 1')
  })
})

describe('POST /api/books', () => {
  test('正常系', async () => {
    const res = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ title: 'New Book', authorId, price: 1000 }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('New Book')
    expect(body).toHaveProperty('id')
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const res = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Book', authorId, price: 1000 }),
    })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const res = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalToken}` },
      body: JSON.stringify({ title: 'New Book', authorId, price: 1000 }),
    })
    expect(res.status).toBe(403)
  })
})

describe('PUT /api/books/:id', () => {
  test('正常系', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ title: 'Updated Book', authorId, price: 2000 }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe('Updated Book')
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Book', authorId, price: 2000 }),
    })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalToken}` },
      body: JSON.stringify({ title: 'Updated Book', authorId, price: 2000 }),
    })
    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/books/:id', () => {
  test('正常系', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, { method: 'DELETE' })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const [book] = await db.select().from(books)
    const res = await app.request(`/api/books/${book.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${normalToken}` },
    })
    expect(res.status).toBe(403)
  })
})
