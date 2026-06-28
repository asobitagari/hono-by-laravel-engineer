import type { User, UserRepository } from '../../domain/users/UserRepository.js'

type UpdateUserOutput = User

export async function updateUserUseCase(repo: UserRepository, id: number, name: string, email: string, isAdmin: boolean): Promise<UpdateUserOutput> {
  return repo.update(id, { name, email, isAdmin })
}
