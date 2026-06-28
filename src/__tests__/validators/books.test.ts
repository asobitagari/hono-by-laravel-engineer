import { describe, expect, test } from 'vitest'
import { createBookSchema, updateBookSchema } from '../../validators/books.js'

describe('createBookSchema', () => {
  test('正常系', () => {
    expect(createBookSchema.safeParse({ title: 'Book', authorId: 1, price: 1000 }).success).toBe(true)
  })
  test('titleが空 → 失敗', () => {
    expect(createBookSchema.safeParse({ title: '', authorId: 1, price: 1000 }).success).toBe(false)
  })
  test('priceが0 → 失敗', () => {
    expect(createBookSchema.safeParse({ title: 'Book', authorId: 1, price: 0 }).success).toBe(false)
  })
  test('priceが負の値 → 失敗', () => {
    expect(createBookSchema.safeParse({ title: 'Book', authorId: 1, price: -100 }).success).toBe(false)
  })
})

describe('updateBookSchema', () => {
  test('正常系', () => {
    expect(updateBookSchema.safeParse({ title: 'Updated', authorId: 1, price: 2000 }).success).toBe(true)
  })
  test('titleが空 → 失敗', () => {
    expect(updateBookSchema.safeParse({ title: '', authorId: 1, price: 2000 }).success).toBe(false)
  })
  test('priceが負の値 → 失敗', () => {
    expect(updateBookSchema.safeParse({ title: 'Updated', authorId: 1, price: -1 }).success).toBe(false)
  })
})
