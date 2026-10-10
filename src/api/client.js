// Thin fetch wrapper. This is the ONLY file that knows HTTP exists --
// authApi.js / profileApi.js call it, and React components never see a
// fetch(), a URL, or a status code.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'pathos:token:v1';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* no-op — see useLocalStorage.js for the same tolerant pattern */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* no-op */
  }
}

/** Thrown for every non-2xx response and every network failure. */
export class ApiClientError extends Error {
  constructor(message, { status, code, offline = false } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    // true when the request never reached the server at all (DNS/connection
    // failure) -- the one case the UI should label OFFLINE rather than FAILED.
    this.offline = offline;
  }
}

/**
 * @param {string} path e.g. "/api/profile"
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object} [options.body]
 * @param {boolean} [options.auth] attach the stored bearer token
 */
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // fetch() itself threw -- the backend is unreachable (not running,
    // wrong URL, no network). This is the OFFLINE case, distinct from the
    // server responding with an error.
    throw new ApiClientError('PathOS backend is unreachable.', { offline: true });
  }

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiClientError(data?.message || 'Request failed.', {
      status: response.status,
      code: data?.code || 'UNKNOWN_ERROR',
    });
  }

  return data;
}
