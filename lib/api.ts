import { getAuthToken } from '@/lib/auth-token';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface RespostaPaginada<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const LIST_LIMIT = 100;

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  auth?: boolean;
}

interface ErrorBody {
  message?: string | string[];
  error?: string;
}

function buildUrl(path: string, query?: ApiRequestOptions['query']) {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function extractErrorMessage(body: ErrorBody | null, fallback: string): string {
  if (!body) {
    return fallback;
  }

  if (Array.isArray(body.message)) {
    return body.message.join(' ');
  }

  return body.message ?? body.error ?? fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique sua conexão e tente novamente.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawText = await response.text();
  const data = rawText ? (JSON.parse(rawText) as unknown) : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data as ErrorBody | null, 'Ocorreu um erro inesperado.'), response.status);
  }

  return data as T;
}

export async function apiDownloadBlob(path: string, options: ApiRequestOptions = {}): Promise<Blob> {
  const { method = 'GET', body, query, auth = true } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique sua conexão e tente novamente.', 0);
  }

  if (!response.ok) {
    const rawText = await response.text();
    let data: ErrorBody | null = null;
    try {
      data = rawText ? (JSON.parse(rawText) as ErrorBody) : null;
    } catch {
      // ignore JSON parse error on non-json error responses
    }
    throw new ApiError(extractErrorMessage(data, 'Erro ao processar o download do arquivo.'), response.status);
  }

  return response.blob();
}
