export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const DEFAULT_STALE_TIME = 1000 * 30;

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export const queryKeys = {
  users: ['users'] as const,
  user: (id: number | string) => ['users', id] as const,
  posts: ['posts'] as const,
  todos: ['todos'] as const,
  userPosts: (id: number | string) => ['users', id, 'posts'] as const,
  userTodos: (id: number | string) => ['users', id, 'todos'] as const,
} as const;
