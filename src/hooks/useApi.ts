import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (e: unknown) {
    const status = (e as { status?: number }).status;
    const isRetryable = status !== undefined && (status >= 500 || status === 429);
    if (retries > 0 && isRetryable) {
      await new Promise(r => setTimeout(r, delayMs));
      return withRetry(fn, retries - 1, delayMs * 2);
    }
    throw e;
  }
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await withRetry(fetcher);
      if (mountedRef.current) setState({ data, loading: false, error: null });
    } catch (e: unknown) {
      if (mountedRef.current) setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Something went wrong' });
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    refetch();
    return () => { mountedRef.current = false; };
  }, [refetch]);

  return { ...state, refetch };
}

export function useMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (...args: TArgs): Promise<TResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { mutate, loading, error };
}
