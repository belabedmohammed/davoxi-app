import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { businessApi } from '../api/businesses';
import { useAuth } from './AuthContext';
import type { Business } from '../types';

interface BusinessContextValue {
  businesses: Business[];
  activeBusiness: Business | null;
  loading: boolean;
  error: string | null;
  setActiveBusinessId: (id: string) => void;
  refetch: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

const STORAGE_ACTIVE_BIZ = 'davoxi_active_business';
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeId, setActiveId] = useState<string | null>(() => localStorage.getItem(STORAGE_ACTIVE_BIZ));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);

  const fetchBusinesses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const attempt = async (): Promise<Business[]> => {
      try {
        return await businessApi.list();
      } catch (e) {
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          await new Promise(r => setTimeout(r, RETRY_DELAY));
          return attempt();
        }
        throw e;
      }
    };

    try {
      retryCount.current = 0;
      const data = await attempt();
      setBusinesses(data);
      // Auto-select first business if none selected or selected doesn't exist
      if (data.length > 0) {
        const exists = data.some(b => b.business_id === activeId);
        if (!exists) {
          setActiveId(data[0].business_id);
          localStorage.setItem(STORAGE_ACTIVE_BIZ, data[0].business_id);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load businesses';
      setError(`Unable to load businesses: ${msg}. Please try refreshing the page.`);
    } finally {
      setLoading(false);
    }
  }, [user, activeId]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const setActiveBusinessId = useCallback((id: string) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_ACTIVE_BIZ, id);
  }, []);

  const activeBusiness = businesses.find(b => b.business_id === activeId) ?? businesses[0] ?? null;

  return (
    <BusinessContext.Provider value={{
      businesses,
      activeBusiness,
      loading,
      error,
      setActiveBusinessId,
      refetch: fetchBusinesses,
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used inside BusinessProvider');
  return ctx;
}
