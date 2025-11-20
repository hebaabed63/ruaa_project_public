import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminService } from '../services/adminService';

export const useAdminComplaints = () => {
  return useQuery('adminComplaints', 
    () => adminService.getAllComplaints(),
    {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ complaintId, status }) => adminService.updateComplaintStatus(complaintId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminComplaints');
      },
    }
  );
};

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (complaintId) => adminService.deleteComplaint(complaintId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminComplaints');
      },
    }
  );
};

export const useComplaintsStats = () => {
  return useQuery('complaintsStats', 
    () => adminService.getComplaintsStats(),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};