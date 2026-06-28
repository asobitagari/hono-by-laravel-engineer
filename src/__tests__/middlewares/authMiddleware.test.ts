import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { authMiddleware } from '../../middlewares/authMiddleware.js'
import { generateAccessToken } from '../../shared/token.js'
import { db } from '../../db/index.js'
import { users } from '../../db/schema.js'
import { hashPassword } from '../../shared/password.js'

const app = new Hono()
app.get('/protected', authMiddleware, (c) => c.json({ ok: true }))

let userId: number

beforeEach(async () => {
  const [user] = await db.insert(users).values({
    name: 'Test', email: 'test@test.com',
    password: await hashPassword('pass'), isAdmin: false,
  }).returning()
  userId = user.id
})

afterEach(async () => {
  await db.delete(users)
})

describe('authMiddleware', () => {
  test('Authorizationヘッダーなし → 401', async () => {
    const res = await app.request('/protected')
    expect(res.status).toBe(401)
  })

  test('Bearer形式でない → 401', async () => {
    const res = await app.request('/protected', {
      headers: { 'Authorization': 'Token some-token' },
    })
    expect(res.status).toBe(401)
  })

  test('不正なJWT → 401', async () => {
    const res = await app.request('/protected', {
      headers: { 'Authorization': 'Bearer invalid.jwt.token' },
    })
    expect(res.status).toBe(401)
  })

  test('有効なJWT → 通過', async () => {
    const token = await generateAccessToken(userId)
    const res = await app.request('/protected', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('存在しないユーザーのJWT → 401', async () => {
    const token = await generateAccessToken(99999)
    const res = await app.request('/protected', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    expect(res.status).toBe(401)
  })
})
