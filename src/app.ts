import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { authRoute } from './routes/auth.js'
import { authorsRoute } from './routes/authors.js'
import { booksRoute } from './routes/books.js'
import { profileRoute } from './routes/profile.js'
import { usersRoute } from './routes/users.js'

const app = new Hono()

app.use(logger())
app.use(cors())

app.route('/api/auth', authRoute)
app.route('/api/profile', profileRoute)
app.route('/api/authors', authorsRoute)
app.route('/api/books', booksRoute)
app.route('/api/users', usersRoute)

export { app }
