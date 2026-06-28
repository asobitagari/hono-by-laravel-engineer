import type { Book, BookRepository } from '../../domain/books/BookRepository.js'

type CreateBookOutput = Book

export async function createBookUseCase(repo: BookRepository, title: string, authorId: number, price: number): Promise<CreateBookOutput> {
  return repo.create({ title, authorId, price })
}
