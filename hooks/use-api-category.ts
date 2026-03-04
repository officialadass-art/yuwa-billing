import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QUERY_KEYS } from '../constants/queryKeys';
import { ApiResponse, Category } from '@/types';

/**
 * Get Categories Hook
 */
const fetchCategories = async (tenantId: string) => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>(
    `/tenants/${tenantId}/categories`
  );
  return data.data;
};

interface UseCategoriesOptions extends Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
  tenantId?: string;
}

export const useApiCategories = ({ tenantId, enabled = true, ...options }: UseCategoriesOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, tenantId],
    queryFn: () => fetchCategories(tenantId || ''),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!tenantId,
    ...options,
  });
};