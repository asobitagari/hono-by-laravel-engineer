import type { RefreshTokenRepository } from '../../domain/refreshTokens/RefreshTokenRepository.js'

export async function logoutUseCase(repo: RefreshTokenRepository, refreshToken: string): Promise<{ success: boolean }> {
  await repo.deleteByToken(refreshToken)
  return { success: true }
}
