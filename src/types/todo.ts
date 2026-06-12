export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoAction =
  | { type: 'ADD'; title: string }
  | { type: 'DELETE'; id: string }
  | { type: 'TOGGLE'; id: string };
