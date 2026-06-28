import type { UserRepository } from '../../domain/users/UserRepository.js'
import type { RefreshTokenRepository } from '../../domain/refreshTokens/RefreshTokenRepository.js'
import { generateAccessToken, generateRefreshToken, refreshTokenExpiresAt } from '../../shared/token.js'

type RegisterOutput = {
  accessToken: string
  refreshToken: string
  email: string
}

export async function registerUseCase(
  userRepo: UserRepository,
  refreshTokenRepo: RefreshTokenRepository,
  email: string,
  password: string,
): Promise<RegisterOutput> {
  const user = await userRepo.create({ name: email, email, password })

  const accessToken = await generateAccessToken(user.id)
  const refreshToken = generateRefreshToken()
  await refreshTokenRepo.create(user.id, refreshToken, refreshTokenExpiresAt())

  return { accessToken, refreshToken, email: user.email }
}
