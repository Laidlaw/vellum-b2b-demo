import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

export function useApi<T>(
  queryKey: string[],
  fetcher: () => Promise<Response>,
  options: UseApiOptions = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetcher();
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: ApiResponse<T> = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      return data.data;
    },
    enabled: options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
  });
}

export function usePaginatedApi<T>(
  queryKey: string[],
  fetcher: () => Promise<Response>,
  options: UseApiOptions = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetcher();
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: PaginatedResponse<T> = await response.json();
      return data;
    },
    enabled: options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    staleTime: options.staleTime ?? 5 * 60 * 1000,
  });
}

export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<Response>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  } = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: ApiResponse<TData> = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      return data.data;
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}