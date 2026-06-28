import type { RefreshTokenRepository } from '../../domain/refreshTokens/RefreshTokenRepository.js'
import { generateAccessToken, generateRefreshToken, refreshTokenExpiresAt } from '../../shared/token.js'

type RefreshTokenOutput = {
  accessToken: string
  refreshToken: string
}

export async function refreshTokenUseCase(
  repo: RefreshTokenRepository,
  token: string,
): Promise<RefreshTokenOutput> {
  const stored = await repo.findByToken(token)
  if (!stored) throw new Error('Invalid refresh token')
  if (stored.expiresAt < new Date()) throw new Error('Refresh token expired')

  await repo.deleteByToken(token)

  const accessToken = await generateAccessToken(stored.userId)
  const newRefreshToken = generateRefreshToken()
  await repo.create(stored.userId, newRefreshToken, refreshTokenExpiresAt())

  return { accessToken, refreshToken: newRefreshToken }
}
