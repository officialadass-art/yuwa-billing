import { APIEndpoints } from '@/constants/apiEndpoint';
import { ApiResponse, Invoice } from '@/types';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Get Invoices List Hook
 */
const fetchInvoices = async (tenantId: string) => {
  const { data } = await apiClient.get<ApiResponse<Invoice[]>>(
    APIEndpoints.invoices.list.replace(':tenantId', tenantId)
  );
  return data;
};

interface UseInvoicesOptions extends Omit<UseQueryOptions<Invoice[], Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
  tenantId?: string;
}

export const useApiInvoices = ({ tenantId, enabled = true, ...options }: UseInvoicesOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICES, tenantId],
    queryFn: () => fetchInvoices(tenantId || ''),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!tenantId,
    ...options,
  });
};

/**
 * Get Invoice Details Hook
 */
const fetchInvoiceDetails = async (tenantId: string, invoiceId: string) => {
  const { data } = await apiClient.get<ApiResponse<Invoice>>(
    APIEndpoints.invoices.details
      .replace(':tenantId', tenantId)
      .replace(':invoiceId', invoiceId)
  );
  return data;
};

interface UseInvoiceDetailsOptions extends Omit<UseQueryOptions<Invoice, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
  tenantId?: string;
  invoiceId?: string;
}

export const useApiInvoiceDetails = ({ tenantId, invoiceId, enabled = true, ...options }: UseInvoiceDetailsOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICE_DETAILS, tenantId, invoiceId],
    queryFn: () => fetchInvoiceDetails(tenantId || '', invoiceId || ''),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!tenantId && !!invoiceId,
    ...options,
  });
};

/**
 * Create Invoice Hook
 */
interface CreateInvoicePayload extends Omit<Invoice, 'id' | 'createdAt' | 'totalAmount' | 'tenantId' | 'subTotal' | 'status'> {}

const createInvoice = async (tenantId: string, invoice: CreateInvoicePayload) => {
  const { data } = await apiClient.post<ApiResponse>(
    APIEndpoints.invoices.create.replace(':tenantId', tenantId),
    invoice
  );
  return data;
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, invoice }: { tenantId: string; invoice: CreateInvoicePayload }) =>
      createInvoice(tenantId, invoice),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: [ QUERY_KEYS.DASHBOARD, tenantId] });
      queryClient.invalidateQueries({ queryKey: [ QUERY_KEYS.INVOICES, tenantId] });
    },
    onError: (error) => {
      console.log('Failed to create invoice', error);
    },
  });
};