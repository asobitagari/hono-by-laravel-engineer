import type { BookRepository } from '../../domain/books/BookRepository.js'

type DeleteBookOutput = { success: boolean }

export async function deleteBookUseCase(repo: BookRepository, id: number): Promise<DeleteBookOutput> {
  await repo.delete(id)
  return { success: true }
}
