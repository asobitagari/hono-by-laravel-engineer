import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { authors, books, users } from './schema.js'
import { hashPassword } from '../shared/password.js'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite)

// users
const [admin, normal] = await db.insert(users).values([
  { name: '管理者君', email: 'admin@example.com', password: await hashPassword('password'), isAdmin: true },
  { name: '一般君',   email: 'normal@example.com', password: await hashPassword('password'), isAdmin: false },
]).returning()

console.log('users:', admin.id, normal.id)

// authors
const [author1, author2, author3] = await db.insert(authors).values([
  { name: '夏目漱石', email: 'soseki@example.com' },
  { name: '芥川龍之介', email: 'akutagawa@example.com' },
  { name: '太宰治', email: 'dazai@example.com' },
]).returning()

console.log('authors:', author1.id, author2.id, author3.id)

// books
await db.insert(books).values([
  { title: 'こころ',       authorId: author1.id, price: 600 },
  { title: '坊っちゃん',   authorId: author1.id, price: 500 },
  { title: '羅生門',       authorId: author2.id, price: 400 },
  { title: '蜘蛛の糸',     authorId: author2.id, price: 350 },
  { title: '人間失格',     authorId: author3.id, price: 550 },
])

console.log('seed completed')
sqlite.close()
