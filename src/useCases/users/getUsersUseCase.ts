import type { User, UserRepository } from '../../domain/users/UserRepository.js'

type GetUsersOutput = User[]

export async function getUsersUseCase(repo: UserRepository): Promise<GetUsersOutput> {
  return repo.findAll()
}
