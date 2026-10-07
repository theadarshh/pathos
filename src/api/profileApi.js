// Thin wrapper around the profile endpoints. Both calls are authenticated
// (the bearer token is attached by client.js) and the backend scopes the
// result to whoever that token belongs to -- no id is ever passed from here.
import { request } from './client.js';

/**
 * @returns {Promise<{ role, experience, skills, goal, complete }>}
 */
export function getProfile() {
  return request('/api/profile', { method: 'GET' });
}

/**
 * @param {{ role, experience, skills, goal, complete }} profile
 * @returns {Promise<{ role, experience, skills, goal, complete }>}
 */
export function updateProfile(profile) {
  return request('/api/profile', { method: 'PUT', body: profile });
}
