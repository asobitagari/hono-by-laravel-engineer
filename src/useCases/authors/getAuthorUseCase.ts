import type { Author, AuthorRepository } from '../../domain/authors/AuthorRepository.js'

type GetAuthorOutput = Author

export async function getAuthorUseCase(repo: AuthorRepository, id: number): Promise<GetAuthorOutput> {
  return repo.findById(id)
}
