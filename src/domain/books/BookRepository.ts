export type Book = {
  id: number
  title: string
  authorId: number
  price: number
}

export type CreateBookInput = {
  title: string
  authorId: number
  price: number
}

export type UpdateBookInput = {
  title: string
  authorId: number
  price: number
}

export interface BookRepository {
  findAll(): Promise<Book[]>
  findById(id: number): Promise<Book>
  create(input: CreateBookInput): Promise<Book>
  update(id: number, input: UpdateBookInput): Promise<Book>
  delete(id: number): Promise<void>
}
