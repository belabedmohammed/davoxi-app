import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { api, STORAGE_REFRESH, setAccessToken } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  org_id: string;
  organization: string;
  created_at?: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  idleWarning: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, organization: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  dismissIdleWarning: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_USER = 'voiceai_user';
const IDLE_TIMEOUT = 30 * 60 * 1000;
const WARNING_BEFORE = 2 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [idleWarning, setIdleWarning] = useState(false);
  const logoutTimerRef = useRef<number>(0);
  const warningTimerRef = useRef<number>(0);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_REFRESH);
    setAccessToken(null);
    setUser(null);
    setToken(null);
    setIdleWarning(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_USER);
    const rt = localStorage.getItem(STORAGE_REFRESH);
    if (storedUser && rt) {
      api.post<{ access_token: string; refresh_token: string }>('/auth/refresh', { refresh_token: rt })
        .then((res) => {
          setAccessToken(res.access_token);
          localStorage.setItem(STORAGE_REFRESH, res.refresh_token);
          try {
            const parsed = JSON.parse(storedUser);
            const safeUser: User = {
              id: String(parsed.id ?? ''),
              name: String(parsed.name ?? ''),
              email: String(parsed.email ?? ''),
              org_id: String(parsed.org_id ?? ''),
              organization: String(parsed.organization ?? ''),
            };
            if (!safeUser.id || !safeUser.org_id || !safeUser.email) {
              clearSession();
            } else {
              setUser(safeUser);
            }
          } catch {
            clearSession();
          }
          setToken(res.access_token);
        })
        .catch(() => {
          clearSession();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const rt = localStorage.getItem(STORAGE_REFRESH);
        if (!rt) { setUser(null); setToken(null); setAccessToken(null); }
      }
    };
    window.addEventListener('pageshow', handler);
    return () => window.removeEventListener('pageshow', handler);
  }, []);

  useEffect(() => {
    const handler = () => clearSession();
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, [clearSession]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_REFRESH && e.newValue === null) {
        setAccessToken(null);
        setUser(null);
        setToken(null);
        setIdleWarning(false);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const idleWarningRef = useRef(false);

  const startIdleTimers = useCallback(() => {
    clearTimeout(warningTimerRef.current);
    clearTimeout(logoutTimerRef.current);
    setIdleWarning(false);
    idleWarningRef.current = false;

    warningTimerRef.current = window.setTimeout(() => {
      setIdleWarning(true);
      idleWarningRef.current = true;
    }, IDLE_TIMEOUT - WARNING_BEFORE);

    logoutTimerRef.current = window.setTimeout(() => {
      clearSession();
    }, IDLE_TIMEOUT);
  }, [clearSession]);

  useEffect(() => {
    if (!user) return;
    startIdleTimers();
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
    const handleActivity = () => {
      if (idleWarningRef.current) return;
      startIdleTimers();
    };
    events.forEach(e => window.addEventListener(e, handleActivity));
    return () => {
      clearTimeout(warningTimerRef.current);
      clearTimeout(logoutTimerRef.current);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [user, startIdleTimers]);

  const dismissIdleWarning = useCallback(() => {
    startIdleTimers();
  }, [startIdleTimers]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    setAccessToken(res.access_token);
    localStorage.setItem(STORAGE_REFRESH, res.refresh_token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(res.user));
    setUser(res.user);
    setToken(res.access_token);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, organization: string) => {
    const res = await api.post<AuthResponse>('/auth/signup', {
      name, email, password, org_name: organization,
    });
    setAccessToken(res.access_token);
    localStorage.setItem(STORAGE_REFRESH, res.refresh_token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(res.user));
    setUser(res.user);
    setToken(res.access_token);
  }, []);

  const logout = useCallback(async () => {
    const rt = localStorage.getItem(STORAGE_REFRESH);
    try { if (rt) await api.post('/auth/logout', { refresh_token: rt }); } catch { /* ignore */ }
    clearSession();
  }, [clearSession]);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, idleWarning, login, signup, logout, updateProfile, dismissIdleWarning }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
