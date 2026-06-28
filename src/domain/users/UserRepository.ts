export type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export type UserWithPassword = User & { password: string }

export type CreateUserInput = {
  name: string
  email: string
  password: string
  isAdmin: boolean
}

export type UpdateUserInput = {
  name: string
  email: string
  isAdmin: boolean
}

export interface UserRepository {
  findAll(): Promise<User[]>
  findById(id: number): Promise<User>
  findByEmail(email: string): Promise<UserWithPassword>
  create(input: CreateUserInput): Promise<User>
  update(id: number, input: UpdateUserInput): Promise<User>
  updatePassword(id: number, hashedPassword: string): Promise<void>
  delete(id: number): Promise<void>
}
