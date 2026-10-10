// Read-only career-knowledge endpoints (V2.1). These are PUBLIC on the
// backend (see SecurityConfig) -- no bearer token is attached, and none
// of these calls ever throw for "not signed in". A caller still has to
// handle `offline`/any rejection itself: this module makes no assumption
// about the backend being reachable, matching the rest of src/api/.
import { request } from './client.js';

export function getSkillCategories() {
  return request('/api/skill-categories', { method: 'GET', auth: false });
}

export function getSkills() {
  return request('/api/skills', { method: 'GET', auth: false });
}

export function getSkill(id) {
  return request(`/api/skills/${id}`, { method: 'GET', auth: false });
}

export function getCareerPaths() {
  return request('/api/career-paths', { method: 'GET', auth: false });
}

export function getCareerPath(id) {
  return request(`/api/career-paths/${id}`, { method: 'GET', auth: false });
}

export function getCareerPathRequirements(id) {
  return request(`/api/career-paths/${id}/requirements`, { method: 'GET', auth: false });
}
