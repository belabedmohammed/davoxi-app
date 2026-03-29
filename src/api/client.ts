const BASE_URL = import.meta.env.VITE_API_URL || '';

const STORAGE_REFRESH = 'voiceai_refresh_token';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

class ApiError extends Error {
  status: number;
  body?: Record<string, unknown>;
  constructor(status: number, message: string, body?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  const rt = localStorage.getItem(STORAGE_REFRESH);
  if (!rt) throw new ApiError(401, 'No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: rt }),
  });

  if (!res.ok) {
    accessToken = null;
    localStorage.removeItem(STORAGE_REFRESH);
    throw new ApiError(401, 'Session expired');
  }

  const data = await res.json();
  accessToken = data.access_token;
  localStorage.setItem(STORAGE_REFRESH, data.refresh_token);
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = accessToken;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && retry && localStorage.getItem(STORAGE_REFRESH)) {
    if (!refreshPromise) refreshPromise = refreshToken().finally(() => { refreshPromise = null; });
    try {
      await refreshPromise;
      return request<T>(path, options, false);
    } catch {
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new ApiError(401, 'Session expired');
    }
  }

  if (!res.ok) {
    let body: Record<string, unknown> = {};
    let msg = res.statusText;
    try {
      body = await res.json();
      msg = (body.message as string) || (body.error as string) || msg;
    } catch { /* text body */ }
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string, body?: unknown) => request<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};

export { ApiError, STORAGE_REFRESH };
