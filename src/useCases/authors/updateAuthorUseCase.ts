import type { Author, AuthorRepository } from '../../domain/authors/AuthorRepository.js'

type UpdateAuthorOutput = Author

export async function updateAuthorUseCase(repo: AuthorRepository, id: number, name: string, email?: string): Promise<UpdateAuthorOutput> {
  return repo.update(id, { name, email })
}
