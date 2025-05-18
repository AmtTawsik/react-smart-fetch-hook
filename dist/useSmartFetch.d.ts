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
export declare function useSmartFetch<T = unknown>(url: string, options?: UseSmartFetchOptions<T>): {
    data: T | null;
    error: Error | null;
    loading: boolean;
    refetch: () => Promise<void>;
};
export {};
