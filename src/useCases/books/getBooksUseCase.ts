import type { Book, BookRepository } from '../../domain/books/BookRepository.js'

type GetBooksOutput = Book[]

export async function getBooksUseCase(repo: BookRepository): Promise<GetBooksOutput> {
  return repo.findAll()
}
