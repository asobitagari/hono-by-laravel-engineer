import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { type UserRepository } from '../domain/users/UserRepository.js'
import { type RefreshTokenRepository } from '../domain/refreshTokens/RefreshTokenRepository.js'
import { loginUseCase } from '../useCases/auth/loginUseCase.js'
import { logoutUseCase } from '../useCases/auth/logoutUseCase.js'
import { refreshTokenUseCase } from '../useCases/auth/refreshTokenUseCase.js'
import { registerUseCase } from '../useCases/auth/registerUseCase.js'
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from '../validators/auth.js'

export function createAuthRoute(userRepo: UserRepository, refreshTokenRepo: RefreshTokenRepository) {
const app = new Hono()

app.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  try {
    const result = await loginUseCase(userRepo, refreshTokenRepo, email, password)
    return c.json(result, 200)
  } catch {
    return c.json({ message: 'Invalid credentials' }, 401)
  }
})

app.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  try {
    const result = await registerUseCase(userRepo, refreshTokenRepo, email, password)
    return c.json(result, 201)
  } catch {
    return c.json({ message: 'Email already in use' }, 409)
  }
})

app.post('/logout', zValidator('json', logoutSchema), async (c) => {
  const { token } = c.req.valid('json')
  const result = await logoutUseCase(refreshTokenRepo, token)
  return c.json(result, 200)
})

app.post('/refresh-token', zValidator('json', refreshTokenSchema), async (c) => {
  const { refreshToken } = c.req.valid('json')
  try {
    const result = await refreshTokenUseCase(refreshTokenRepo, refreshToken)
    return c.json(result, 200)
  } catch {
    return c.json({ message: 'Invalid or expired refresh token' }, 401)
  }
})

  return app
}
