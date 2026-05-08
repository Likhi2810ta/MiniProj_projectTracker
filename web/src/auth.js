import { setToken } from './api';

const SERVER = import.meta.env.VITE_API_URL ?? '';

export async function requestOtp(email, password) {
  const res = await fetch(`${SERVER}/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Failed to send OTP');
  return data;
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${SERVER}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'OTP verification failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${SERVER}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Login failed');
  setToken(data.access_token);
  return data;
}

export function isLoggedIn() {
  const t = localStorage.getItem('auth_token');
  if (!t) return false;
  try {
    const { exp } = jwtDecode(t);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function jwtDecode(token) {
  if (!token) return {};
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}
