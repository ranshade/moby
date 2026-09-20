/**
 * Small API client for moby-api. Replaces the missing @workspace/api-client-react
 * and keeps the same function names, so the screens don't change.
 */
import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';

export type Me = {
  id: number;
  clerkUserId: string;
  name: string;
  email: string;
  avatarKey: string;
};

export type InviteStatus = 'draft' | 'sent';

export type ServerInvite = {
  id: number;
  movieId: string;
  movieTitle: string;
  genre: string;
  runtime: string;
  date: string;
  time: string;
  message: string;
  status: InviteStatus;
};

export type UpdateMeInput = { name?: string; avatarKey?: string };
export type InviteInput = Partial<Omit<ServerInvite, 'id'>>;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let baseUrl = '';
let tokenGetter: (() => Promise<string | null>) | null = null;

export function setBaseUrl(url: string) {
  baseUrl = url.replace(/\/+$/, '');
}

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = tokenGetter ? await tokenGetter() : null;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data?.error === 'string') message = data.error;
    } catch {}
    throw new ApiError(response.status, message);
  }
  return (await response.json()) as T;
}

type QueryOptions<T> = { query?: Partial<Omit<UseQueryOptions<T, ApiError>, 'queryFn'>> };

export function useGetMe(options?: QueryOptions<Me>) {
  return useQuery<Me, ApiError>({
    queryKey: ['getMe'],
    queryFn: () => request<Me>('GET', '/api/me'),
    ...options?.query,
  });
}

export function useListInvites(options?: QueryOptions<ServerInvite[]>) {
  return useQuery<ServerInvite[], ApiError>({
    queryKey: ['listInvites'],
    queryFn: () => request<ServerInvite[]>('GET', '/api/invites'),
    ...options?.query,
  });
}

export function useUpdateMe() {
  return useMutation<Me, ApiError, { data: UpdateMeInput }>({
    mutationFn: ({ data }) => request<Me>('PATCH', '/api/me', data),
  });
}

export function useCreateInvite() {
  return useMutation<ServerInvite, ApiError, { data: InviteInput }>({
    mutationFn: ({ data }) => request<ServerInvite>('POST', '/api/invites', data),
  });
}

export function useUpdateInvite() {
  return useMutation<ServerInvite, ApiError, { id: number; data: InviteInput }>({
    mutationFn: ({ id, data }) => request<ServerInvite>('PATCH', `/api/invites/${id}`, data),
  });
}
