import { APIEndpoints } from '@/constants/apiEndpoint';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * 
 * @param phone 
 * @returns 
 */
const loginApiRequest = async (phone: string) => {
    const {data} = await apiClient.post(APIEndpoints.auth.sendOtp, {phone})
    return data
}
export const useApiSendOTP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginApiRequest
    })
}

/**
 * 
 * @param phone string
 * @param code string
 */
const verifyOtpApiRequest = async ({phone, code}: {phone: string, code: string}) => {
    const {data} = await apiClient.post(APIEndpoints.auth.verifyOtp, {phone, code})
    return data
}
export const useVerifyOtpRequest = () => {
    return useMutation({
        mutationFn: verifyOtpApiRequest
    })
}