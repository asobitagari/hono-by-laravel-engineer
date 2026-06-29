import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { createAuthorsRoute } from '../../routes/authors.js'
import { DrizzleAuthorRepository } from '../../infrastructure/repositories/DrizzleAuthorRepository.js'
import { db } from '../../db/index.js'
import { authors, users } from '../../db/schema.js'
import { hashPassword } from '../../shared/password.js'
import { generateAccessToken } from '../../shared/token.js'

const app = new Hono()
app.route('/api/authors', createAuthorsRoute(new DrizzleAuthorRepository()))

let adminToken: string
let normalToken: string

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

  await db.insert(authors).values([
    { name: 'Author 1', email: 'author1@example.com' },
    { name: 'Author 2', email: 'author2@example.com' },
  ])
})

afterEach(async () => {
  await db.delete(authors)
  await db.delete(users)
})

describe('GET /api/authors', () => {
  test('一覧取得', async () => {
    const res = await app.request('/api/authors')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(2)
    expect(body[0]).toHaveProperty('id')
    expect(body[0]).toHaveProperty('name')
  })
})

describe('GET /api/authors/:id', () => {
  test('個別取得', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(author.id)
    expect(body.name).toBe('Author 1')
  })
})

describe('POST /api/authors', () => {
  test('正常系', async () => {
    const res = await app.request('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'New Author', email: 'new@example.com' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.name).toBe('New Author')
    expect(body).toHaveProperty('id')
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const res = await app.request('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Author', email: 'new@example.com' }),
    })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const res = await app.request('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalToken}` },
      body: JSON.stringify({ name: 'New Author', email: 'new@example.com' }),
    })
    expect(res.status).toBe(403)
  })
})

describe('PUT /api/authors/:id', () => {
  test('正常系', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Updated Author' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('Updated Author')
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Author' }),
    })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalToken}` },
      body: JSON.stringify({ name: 'Updated Author' }),
    })
    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/authors/:id', () => {
  test('正常系', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, { method: 'DELETE' })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const [author] = await db.select().from(authors)
    const res = await app.request(`/api/authors/${author.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${normalToken}` },
    })
    expect(res.status).toBe(403)
  })
})
