import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, ApiResponse, PaginatedResponse } from '../../../shared/types';

interface UseUsersParams {
  companyId?: string;
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useUsers(params: UseUsersParams = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.companyId) searchParams.append('companyId', params.companyId);
  if (params.search) searchParams.append('search', params.search);
  if (params.department && params.department !== 'All') searchParams.append('department', params.department);
  if (params.status && params.status !== 'All') searchParams.append('status', params.status.toLowerCase());
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  return useQuery({
    queryKey: ['users', params],
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const response = await fetch(`/api/users?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    }
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const result: ApiResponse<User> = await response.json();
      return result.data;
    },
    enabled: !!userId
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'pending' }) => {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to get user statistics
export function useUserStats(companyId?: string) {
  return useQuery({
    queryKey: ['user-stats', companyId],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (companyId) searchParams.append('companyId', companyId);
      
      const response = await fetch(`/api/users?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users for stats');
      }
      
      const result: PaginatedResponse<User> = await response.json();
      const users = result.data;
      
      return {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        pending: users.filter(u => u.status === 'pending').length,
        departments: new Set(users.map(u => u.department)).size,
        byRole: {
          admin: users.filter(u => u.role === 'admin').length,
          manager: users.filter(u => u.role === 'manager').length,
          purchaser: users.filter(u => u.role === 'purchaser').length,
          'sub-contractor': users.filter(u => u.role === 'sub-contractor').length,
        },
        byDepartment: users.reduce((acc, user) => {
          acc[user.department] = (acc[user.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }
  });
}