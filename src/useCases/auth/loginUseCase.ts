import type { UserRepository } from '../../domain/users/UserRepository.js'
import type { RefreshTokenRepository } from '../../domain/refreshTokens/RefreshTokenRepository.js'
import { verifyPassword } from '../../shared/password.js'
import { generateAccessToken, generateRefreshToken, refreshTokenExpiresAt } from '../../shared/token.js'

type LoginOutput = {
  accessToken: string
  refreshToken: string
  email: string
}

export async function loginUseCase(
  userRepo: UserRepository,
  refreshTokenRepo: RefreshTokenRepository,
  email: string,
  password: string,
): Promise<LoginOutput> {
  const user = await userRepo.findByEmail(email)
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) throw new Error('Invalid credentials')

  const accessToken = await generateAccessToken(user.id)
  const refreshToken = generateRefreshToken()
  await refreshTokenRepo.create(user.id, refreshToken, refreshTokenExpiresAt())

  return { accessToken, refreshToken, email: user.email }
}
