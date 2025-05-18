import { useState, useEffect, useCallback, useRef } from "react";

interface UseSmartFetchOptions<T> {
  cacheKey?: string;
  retry?: number;
  refetchOnMount?: boolean;
  refreshInterval?: number;
  cacheExpiry?: number;
  timeout?: number;
  deps?: any[];
  initialData?: T;
}

export function useSmartFetch<T = unknown>(
  url: string,
  options: UseSmartFetchOptions<T> = {}
) {
  const {
    cacheKey,
    retry = 0,
    refetchOnMount = true,
    refreshInterval = 0,
    cacheExpiry,
    timeout = 5000,
    deps = [],
    initialData = null,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    let attempt = 0;
    let success = false;

    while (attempt <= retry && !success) {
      try {
        const timer = setTimeout(
          () => abortControllerRef.current?.abort(),
          timeout
        );

        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timer);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (cacheKey) {
          const cacheData = {
            data: json,
            timestamp: Date.now(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }

        setData(json);
        success = true;
      } catch (err) {
        attempt++;
        if (attempt > retry) {
          setError(err as Error);
        }
      }
    }

    setLoading(false);
  }, [url, retry, cacheKey, timeout]);

  // Cache handling with expiry
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired =
          cacheExpiry && Date.now() - timestamp > cacheExpiry * 1000;
        if (!isExpired) setData(data);
      }
    }
  }, [cacheKey, cacheExpiry]);

  // Initial fetch and refresh interval
  useEffect(() => {
    if (refetchOnMount) fetchData();
    let intervalId: NodeJS.Timeout;
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }
    return () => {
      abortControllerRef.current?.abort();
      clearInterval(intervalId);
    };
  }, [fetchData, refreshInterval, ...deps]);

  return { data, error, loading, refetch: fetchData };
}
