import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, clearToken, TRACKER, authHeaders } from '../api';
import { isLoggedIn } from '../auth';

const AuthContext = createContext({ role: '', email: '', loading: true, refresh: () => {} });

export function AuthProvider({ children }) {
  const [role, setRole]       = useState(() => localStorage.getItem('user_role') || '');
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) { setRole(''); setEmail(''); setLoading(false); return; }
    try {
      const res = await fetch(`${TRACKER}/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRole(data.role || 'lecturer');
      setEmail(data.email || '');
      localStorage.setItem('user_role', data.role || 'lecturer');
    } catch {
      // Fallback to cached value
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{ role, email, loading, refresh, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
