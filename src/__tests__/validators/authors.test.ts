import { describe, expect, test } from 'vitest'
import { createAuthorSchema, updateAuthorSchema } from '../../validators/authors.js'

describe('createAuthorSchema', () => {
  test('正常系', () => {
    expect(createAuthorSchema.safeParse({ name: 'Author', email: 'a@example.com' }).success).toBe(true)
  })
  test('emailは省略可能', () => {
    expect(createAuthorSchema.safeParse({ name: 'Author' }).success).toBe(true)
  })
  test('nameが空 → 失敗', () => {
    expect(createAuthorSchema.safeParse({ name: '' }).success).toBe(false)
  })
  test('nameが100文字超 → 失敗', () => {
    expect(createAuthorSchema.safeParse({ name: 'a'.repeat(101) }).success).toBe(false)
  })
  test('不正なメール → 失敗', () => {
    expect(createAuthorSchema.safeParse({ name: 'Author', email: 'not-email' }).success).toBe(false)
  })
})

describe('updateAuthorSchema', () => {
  test('正常系', () => {
    expect(updateAuthorSchema.safeParse({ name: 'Updated', email: 'a@example.com' }).success).toBe(true)
  })
  test('emailは省略可能', () => {
    expect(updateAuthorSchema.safeParse({ name: 'Updated' }).success).toBe(true)
  })
  test('nameが空 → 失敗', () => {
    expect(updateAuthorSchema.safeParse({ name: '' }).success).toBe(false)
  })
})
