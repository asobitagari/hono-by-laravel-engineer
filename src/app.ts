import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { createAuthRoute } from './routes/auth.js'
import { createAuthorsRoute } from './routes/authors.js'
import { createBooksRoute } from './routes/books.js'
import { createProfileRoute } from './routes/profile.js'
import { createUsersRoute } from './routes/users.js'

import { DrizzleUserRepository } from './infrastructure/repositories/DrizzleUserRepository.js'
import { DrizzleRefreshTokenRepository } from './infrastructure/repositories/DrizzleRefreshTokenRepository.js'
import { DrizzleAuthorRepository } from './infrastructure/repositories/DrizzleAuthorRepository.js'
import { DrizzleBookRepository } from './infrastructure/repositories/DrizzleBookRepository.js'

const userRepo = new DrizzleUserRepository()
const refreshTokenRepo = new DrizzleRefreshTokenRepository()
const authorRepo = new DrizzleAuthorRepository()
const bookRepo = new DrizzleBookRepository()

const app = new Hono()

app.use(logger())
app.use(cors())

app.route('/api/auth', createAuthRoute(userRepo, refreshTokenRepo))
app.route('/api/profile', createProfileRoute(userRepo))
app.route('/api/authors', createAuthorsRoute(authorRepo))
app.route('/api/books', createBooksRoute(bookRepo))
app.route('/api/users', createUsersRoute(userRepo))

export { app }
