import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { refreshTokens } from '../../db/schema.js'
import type { RefreshTokenRepository } from '../../domain/refreshTokens/RefreshTokenRepository.js'

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  async create(userId: number, token: string, expiresAt: Date): Promise<void> {
    await db.insert(refreshTokens).values({ userId, token, expiresAt })
  }

  async findByToken(token: string): Promise<{ userId: number; expiresAt: Date } | null> {
    const result = await db
      .select({ userId: refreshTokens.userId, expiresAt: refreshTokens.expiresAt })
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
    return result[0] ?? null
  }

  async deleteByToken(token: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
  }

  async deleteByUserId(userId: number): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId))
  }
}
