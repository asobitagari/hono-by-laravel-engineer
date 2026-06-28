import type { User, UserRepository } from '../../domain/users/UserRepository.js'

type GetUserOutput = User

export async function getUserUseCase(repo: UserRepository, id: number): Promise<GetUserOutput> {
  return repo.findById(id)
}
