import type { User, UserRepository } from '../../domain/users/UserRepository.js'

export async function updateProfileNameService(repo: UserRepository, userId: number, name: string): Promise<User> {
  const current = await repo.findById(userId)
  return repo.update(userId, { name, email: current.email, isAdmin: current.isAdmin })
}
