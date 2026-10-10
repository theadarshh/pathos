// Thin wrapper around the two auth endpoints. Components never call
// fetch() or know a token exists -- they call register()/login(), and on
// success the token is already stored (via client.js's setToken) for every
// subsequent authenticated request.
import { request, setToken, clearToken } from './client.js';

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ userId: string, email: string }>}
 */
export async function register(email, password) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setToken(data.token);
  return { userId: data.userId, email: data.email };
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ userId: string, email: string }>}
 */
export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setToken(data.token);
  return { userId: data.userId, email: data.email };
}

export function logout() {
  clearToken();
}
