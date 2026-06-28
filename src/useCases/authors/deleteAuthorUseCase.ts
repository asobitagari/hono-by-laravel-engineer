import type { AuthorRepository } from '../../domain/authors/AuthorRepository.js'

type DeleteAuthorOutput = { success: boolean }

export async function deleteAuthorUseCase(repo: AuthorRepository, id: number): Promise<DeleteAuthorOutput> {
  await repo.delete(id)
  return { success: true }
}
