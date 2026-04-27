import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
export const TRACKER  = `${API_BASE}/api/tracker`;

/**
 * Returns fetch-ready headers with the stored JWT.
 * Pass json=false for multipart/form-data requests (let fetch set the boundary).
 */
export async function authHeaders(json = true) {
  const token = (await AsyncStorage.getItem('auth_token')) ?? '';
  const h = { Authorization: `Bearer ${token}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}
