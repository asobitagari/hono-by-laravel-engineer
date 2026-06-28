import type { Book, BookRepository } from '../../domain/books/BookRepository.js'

type GetBookOutput = Book

export async function getBookUseCase(repo: BookRepository, id: number): Promise<GetBookOutput> {
  return repo.findById(id)
}
