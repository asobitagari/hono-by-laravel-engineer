import { describe, expect, test } from 'vitest'
import { loginSchema, registerSchema, logoutSchema, refreshTokenSchema } from '../../validators/auth.js'

describe('loginSchema', () => {
  test('正常系', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: 'secret' }).success).toBe(true)
  })
  test('不正なメール → 失敗', () => {
    expect(loginSchema.safeParse({ email: 'not-email', password: 'secret' }).success).toBe(false)
  })
  test('パスワードが空 → 失敗', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: '' }).success).toBe(false)
  })
})

describe('registerSchema', () => {
  test('正常系', () => {
    expect(registerSchema.safeParse({ email: 'test@example.com', password: 'password123' }).success).toBe(true)
  })
  test('パスワードが8文字未満 → 失敗', () => {
    expect(registerSchema.safeParse({ email: 'test@example.com', password: 'short' }).success).toBe(false)
  })
})

describe('logoutSchema', () => {
  test('正常系', () => {
    expect(logoutSchema.safeParse({ token: 'some-token' }).success).toBe(true)
  })
  test('tokenが空 → 失敗', () => {
    expect(logoutSchema.safeParse({ token: '' }).success).toBe(false)
  })
})

describe('refreshTokenSchema', () => {
  test('正常系', () => {
    expect(refreshTokenSchema.safeParse({ refreshToken: 'some-token' }).success).toBe(true)
  })
  test('refreshTokenが空 → 失敗', () => {
    expect(refreshTokenSchema.safeParse({ refreshToken: '' }).success).toBe(false)
  })
})
