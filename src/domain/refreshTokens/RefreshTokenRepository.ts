export interface RefreshTokenRepository {
  create(userId: number, token: string, expiresAt: Date): Promise<void>
  findByToken(token: string): Promise<{ userId: number; expiresAt: Date } | null>
  deleteByToken(token: string): Promise<void>
  deleteByUserId(userId: number): Promise<void>
}
