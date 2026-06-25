export type TodoStatus = 'pending' | 'completed'

export interface Todo {
  id: string
  title: string
  description?: string
  status: TodoStatus
  createdAt: number
  updatedAt: number
}

export interface CreateTodoInput {
  title: string
  description?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  status?: TodoStatus
}
