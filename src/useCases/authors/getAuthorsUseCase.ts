import type { Author, AuthorRepository } from '../../domain/authors/AuthorRepository.js'

type GetAuthorsOutput = Author[]

export async function getAuthorsUseCase(repo: AuthorRepository): Promise<GetAuthorsOutput> {
  return repo.findAll()
}
