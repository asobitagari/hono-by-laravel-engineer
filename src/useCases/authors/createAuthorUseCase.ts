import type { Author, AuthorRepository } from '../../domain/authors/AuthorRepository.js'

type CreateAuthorOutput = Author

export async function createAuthorUseCase(repo: AuthorRepository, name: string, email?: string): Promise<CreateAuthorOutput> {
  return repo.create({ name, email })
}
