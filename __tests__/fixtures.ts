import type { User } from '@/app/_hooks/use-users';
import type { Post } from '@/app/_hooks/use-posts';
import type { Todo } from '@/app/_hooks/use-todos';

export const usersFixture: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', website: 'ada.dev' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com', website: 'turing.dev' },
];

export const postsFixture: Post[] = [
  { id: 101, userId: 1, title: 'p1', body: 'b1' },
  { id: 102, userId: 1, title: 'p2', body: 'b2' },
  { id: 103, userId: 2, title: 'p3', body: 'b3' },
];

export const todosFixture: Todo[] = [
  { id: 201, userId: 1, title: 't1', completed: true },
  { id: 202, userId: 1, title: 't2', completed: false },
  { id: 203, userId: 2, title: 't3', completed: true },
  { id: 204, userId: 2, title: 't4', completed: true },
];
