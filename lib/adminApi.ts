import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const adminApi = axios.create({ baseURL: API_URL });

adminApi.interceptors.request.use((config) => {
  const token = getCookie('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST' })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return adminApi(originalRequest);
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;

interface Paginated<T> {
  next: string | null;
  results: T[];
}

/** Follows `next` links to collect every page — manager tables need the full list, not just page 1. */
export async function fetchAllPages<T>(url: string, params?: Record<string, string | number>): Promise<T[]> {
  let results: T[] = [];
  let next: string | null = url;
  let first = true;
  while (next) {
    const res: { data: Paginated<T> } = first
      ? await adminApi.get<Paginated<T>>(next, { params })
      : await adminApi.get<Paginated<T>>(next);
    results = results.concat(res.data.results);
    next = res.data.next;
    first = false;
  }
  return results;
}
