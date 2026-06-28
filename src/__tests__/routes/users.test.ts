import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { usersRoute } from '../../routes/users.js'
import { db } from '../../db/index.js'
import { users } from '../../db/schema.js'
import { hashPassword } from '../../shared/password.js'
import { generateAccessToken } from '../../shared/token.js'

const app = new Hono()
app.route('/api/users', usersRoute)

let adminToken: string
let normalToken: string
let normalId: number

beforeEach(async () => {
  const [admin] = await db.insert(users).values({
    name: '管理者君', email: 'admin@example.com',
    password: await hashPassword('password'), isAdmin: true,
  }).returning()
  adminToken = await generateAccessToken(admin.id)

  const [normal] = await db.insert(users).values({
    name: '一般君', email: 'normal@example.com',
    password: await hashPassword('password'), isAdmin: false,
  }).returning()
  normalToken = await generateAccessToken(normal.id)
  normalId = normal.id
})

afterEach(async () => {
  await db.delete(users)
})

describe('GET /api/users', () => {
  test('正常系', async () => {
    const res = await app.request('/api/users')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(2)
    expect(body[0]).not.toHaveProperty('password')
  })
})

describe('GET /api/users/:id', () => {
  test('正常系', async () => {
    const res = await app.request(`/api/users/${normalId}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(normalId)
    expect(body).not.toHaveProperty('password')
  })
})

describe('PUT /api/users/:id', () => {
  test('正常系', async () => {
    const res = await app.request(`/api/users/${normalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: '更新ユーザー', email: 'normal@example.com', isAdmin: false }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('更新ユーザー')
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const res = await app.request(`/api/users/${normalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '更新ユーザー', email: 'normal@example.com', isAdmin: false }),
    })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const res = await app.request(`/api/users/${normalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalToken}` },
      body: JSON.stringify({ name: '更新ユーザー', email: 'normal@example.com', isAdmin: false }),
    })
    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/users/:id', () => {
  test('正常系', async () => {
    const res = await app.request(`/api/users/${normalId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('Authorizationヘッダーなし → 401', async () => {
    const res = await app.request(`/api/users/${normalId}`, { method: 'DELETE' })
    expect(res.status).toBe(401)
  })

  test('管理者でないユーザー → 403', async () => {
    const res = await app.request(`/api/users/${normalId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${normalToken}` },
    })
    expect(res.status).toBe(403)
  })
})
