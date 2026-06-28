import type { UserRepository } from '../../domain/users/UserRepository.js'

type DeleteUserOutput = { success: boolean }

export async function deleteUserUseCase(repo: UserRepository, id: number): Promise<DeleteUserOutput> {
  await repo.delete(id)
  return { success: true }
}
