import type { UserRepository } from '../../domain/users/UserRepository.js'
import { verifyPassword, hashPassword } from '../../shared/password.js'

export async function updatePasswordService(repo: UserRepository, userId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
  const user = await repo.findByEmail((await repo.findById(userId)).email)
  const isValid = await verifyPassword(currentPassword, user.password)
  if (!isValid) throw new Error('Invalid current password')
  await repo.updatePassword(userId, await hashPassword(newPassword))
  return { success: true }
}
