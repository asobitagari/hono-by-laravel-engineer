import { sign, verify } from 'hono/jwt'
import { randomBytes } from 'node:crypto'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required')
const ACCESS_TOKEN_TTL = 60 * 15 // 15 minutes

export async function generateAccessToken(userId: number): Promise<string> {
  return sign(
    { sub: userId, exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL },
    JWT_SECRET,
    'HS256',
  )
}

export async function verifyAccessToken(token: string): Promise<number> {
  const payload = await verify(token, JWT_SECRET, 'HS256')
  return payload.sub as number
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex')
}

export function refreshTokenExpiresAt(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date
}
