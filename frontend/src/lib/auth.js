// src/lib/auth.js
// Pequeno utilitário para armazenar token e wrappers de fetch

export function saveToken(token) {
  try {
    localStorage.setItem('auth.token', token);
  } catch (e) {
    console.warn('Não foi possível salvar token:', e);
  }
}

export function getToken() {
  try {
    return localStorage.getItem('auth.token');
  } catch (e) {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('auth.token');
  } catch (e) {}
}

export function saveUser(user) {
  try {
    localStorage.setItem('auth.user', JSON.stringify(user));
  } catch (e) {
    console.warn('Não foi possível salvar usuário:', e);
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem('auth.user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearUser() {
  try { localStorage.removeItem('auth.user'); } catch (e) {}
}

export async function apiPost(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res;
}

export default {
  saveToken,
  getToken,
  clearToken,
  apiPost,
};
