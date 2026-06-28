import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { authRoute } from '../../routes/auth.js'
import { db } from '../../db/index.js'
import { users } from '../../db/schema.js'
import { hashPassword } from '../../shared/password.js'

const app = new Hono()
app.route('/api/auth', authRoute)

beforeEach(async () => {
  await db.insert(users).values({
    name: 'テストユーザー',
    email: 'test@example.com',
    password: await hashPassword('secret'),
    isAdmin: false,
  })
})

afterEach(async () => {
  await db.delete(users)
})

describe('POST /api/auth/login', () => {
  test('正常系', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('accessToken')
    expect(body).toHaveProperty('refreshToken')
    expect(body.email).toBe('test@example.com')
  })

  test('パスワードが違う → 401', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
    })
    expect(res.status).toBe(401)
  })

  test('存在しないメール → 401', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'noone@example.com', password: 'secret' }),
    })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/register', () => {
  test('正常系', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@example.com', password: 'password123' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toHaveProperty('accessToken')
    expect(body).toHaveProperty('refreshToken')
    expect(body.email).toBe('new@example.com')
  })

  test('既存メールアドレス → 409', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })
    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/logout', () => {
  test('正常系', async () => {
    const res = await app.request('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'some-token' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })
})

describe('POST /api/auth/refresh-token', () => {
  test('正常系', async () => {
    const loginRes = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' }),
    })
    const { refreshToken } = await loginRes.json()

    const res = await app.request('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('accessToken')
    expect(body).toHaveProperty('refreshToken')
  })

  test('無効なリフレッシュトークン → 401', async () => {
    const res = await app.request('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'invalid-token' }),
    })
    expect(res.status).toBe(401)
  })
})
