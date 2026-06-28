import type { Book, BookRepository } from '../../domain/books/BookRepository.js'

type UpdateBookOutput = Book

export async function updateBookUseCase(repo: BookRepository, id: number, title: string, authorId: number, price: number): Promise<UpdateBookOutput> {
  return repo.update(id, { title, authorId, price })
}
