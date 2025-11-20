import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from './services/adminAPI';

export const useAdminDashboardStats = () => {
  return useQuery('adminDashboardStats', 
    () => adminAPI.getDashboardStats(),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useAdminUsers = (filters) => {
  return useQuery(['adminUsers', filters], 
    () => adminAPI.getUsers(filters),
    {
      keepPreviousData: true,
    }
  );
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(adminAPI.updateUserStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminUsers');
    },
  });
};