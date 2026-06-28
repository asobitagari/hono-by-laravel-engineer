export type Author = {
  id: number
  name: string
  email: string | null
}

export type CreateAuthorInput = {
  name: string
  email?: string
}

export type UpdateAuthorInput = {
  name: string
  email?: string
}

export interface AuthorRepository {
  findAll(): Promise<Author[]>
  findById(id: number): Promise<Author>
  create(input: CreateAuthorInput): Promise<Author>
  update(id: number, input: UpdateAuthorInput): Promise<Author>
  delete(id: number): Promise<void>
}
